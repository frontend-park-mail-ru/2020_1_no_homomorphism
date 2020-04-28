import {NAVBAR, GLOBAL, DOM, URL} from '@libs/constans';
import navbar from '@views/navbar/navbar.tmpl.xml';
import BaseView from '@libs/base_view';
import SearchComponent from '@components/search_component/search_component';
import {globalEventBus} from '@libs/eventBus';

/**
 *  вью для навбара
 */
export default class NavbarView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(navbar);
        this.eventBus = eventBus;
        this.searchComponent = new SearchComponent();
        // globalEventBus.on(GLOBAL.REDIRECT, this.setEmpty.bind(this));
        this.eventBus.on(NAVBAR.DRAW_COOKIE_RESULT, this.analyzeCookie.bind(this));
        this.eventBus.on(NAVBAR.RENDER_LOGGED, this.renderLogged.bind(this));
        this.eventBus.on(NAVBAR.RENDER_NOT_LOGGED, this.renderNotLogged.bind(this));
    }

    /**
     * рендерит навбар
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.NAVBAR)[0]);
        this.setEventListeners.bind(this)();
        this.eventBus.emit(NAVBAR.CHECK_COOKIE);
    }

    /**
     * Sets event listeners
     */
    setEventListeners() {
        document.getElementById('logout-link').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.logoutClicked.bind(this)();
        });
        document.getElementsByClassName('m-search-input')[0]
            .addEventListener('keyup', (event) => {
                const value = event.target.value;
                if (event.keyCode === 13 && value !== '') {
                    globalEventBus.emit(GLOBAL.REDIRECT, `/search/${value}`);
                    return;
                }
                this.searchComponent.render(value);
            });
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('m-medium-icon')) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.submit(document.getElementsByClassName('m-search-input')[0].value);
            }
        });
        document.addEventListener('click', this.closeSearchComponent.bind(this));
    }

    /**
     * Подтверждение
     * @param {String} input
     */
    submit(input) {
        if (input !== '') {
            document.getElementsByClassName('m-search-input')[0].value = '';
            globalEventBus.emit(GLOBAL.REDIRECT, `/search/${input}`);
        }
        // alert(input);
    }

    /**
     * Закрытие секции
     * @param {Object} event
     */
    closeSearchComponent(event) {
        const choosePlaylist = document.getElementsByClassName('l-top-content')[0];
        const isClickInside = choosePlaylist.contains(event.target);
        if (!isClickInside) {
            this.searchComponent.close();
        }
    }

    /**
     * Нажатия на логаут
     */
    logoutClicked() {
        this.eventBus.emit(NAVBAR.LOGOUT_CLICKED);
        this.renderNotLogged.bind(this)();
        globalEventBus.emit(GLOBAL.LOGOUT_REDIRECT, URL.MAIN);
        globalEventBus.emit(GLOBAL.CLEAR_AND_LOCK, true);
    }

    /**
     * Проверка куки
     * @param {boolean} loggedIn
     */
    analyzeCookie(loggedIn) {
        if (loggedIn) {
            this.eventBus.emit(NAVBAR.GET_USER_DATA);
        } else {
            this.renderNotLogged.bind(this)();
        }
    }

    /**
     * Залогинен
     * @param {Object} data
     */
    renderLogged(data) {
        document.getElementsByClassName('m-navbar-avatar')[0].src = data.image;
        document.getElementsByClassName('m-navbar-name')[0].innerHTML = data.login;
        document.getElementById('login-link').classList.remove('is-displayed');
        document.getElementById('login-link').classList.add('is-not-displayed');
        document.getElementById('signup-link').classList.remove('is-displayed');
        document.getElementById('signup-link').classList.add('is-not-displayed');
        document.getElementById('logout-link').classList.remove('is-not-displayed');
        document.getElementById('logout-link').classList.add('is-displayed');
        document.getElementById('profile-link').classList.remove('is-not-displayed');
        document.getElementById('profile-link').classList.add('is-displayed');
        document.getElementsByClassName('l-settings-icon')[0].classList.remove('is-not-displayed');
        document.getElementsByClassName('l-settings-icon')[0].classList.add('is-displayed');
    }

    /**
     * не залогинен
     */
    renderNotLogged() {
        document.getElementById('login-link').classList.remove('is-not-displayed');
        document.getElementById('login-link').classList.add('is-displayed');
        document.getElementById('signup-link').classList.remove('is-not-displayed');
        document.getElementById('signup-link').classList.add('is-displayed');
        document.getElementById('logout-link').classList.remove('is-displayed');
        document.getElementById('logout-link').classList.add('is-not-displayed');
        document.getElementById('profile-link').classList.remove('is-displayed');
        document.getElementById('profile-link').classList.add('is-not-displayed');
        document.getElementsByClassName('l-settings-icon')[0].classList.remove('is-displayed');
        document.getElementsByClassName('l-settings-icon')[0].classList.add('is-not-displayed');
    }
}
