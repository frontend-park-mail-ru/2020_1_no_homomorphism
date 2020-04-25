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
        document.addEventListener('click', this.closeSearchComponent.bind(this), {once: true});
        document.getElementById('logout-link').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.logoutClicked.bind(this)();
        });
        document.getElementsByClassName('m-search-input')[0]
            .addEventListener('keyup', (event) => {
                const value = event.target.value;
                this.searchComponent.render(value);
            });
    }

    /**
     * Закрытие секции
     */
    closeSearchComponent() {
        console.log('CLOSE');
    }

    /**
     * Нажатия на логаут
     */
    logoutClicked() {
        this.eventBus.emit(NAVBAR.LOGOUT_CLICKED);
        this.renderNotLogged.bind(this)();
        globalEventBus.emit(GLOBAL.LOGOUT_REDIRECT, URL.MAIN);
        globalEventBus.emit(GLOBAL.CLEAR_AND_LOCK);
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
        document.getElementById('login-link').classList.remove('is-visible');
        document.getElementById('login-link').classList.add('is-hidden');
        document.getElementById('signup-link').classList.remove('is-visible');
        document.getElementById('signup-link').classList.add('is-hidden');
        document.getElementById('logout-link').classList.remove('is-hidden');
        document.getElementById('logout-link').classList.add('is-visible');
        document.getElementById('profile-link').classList.remove('is-hidden');
        document.getElementById('profile-link').classList.add('is-visible');
        document.getElementsByClassName('l-settings-icon')[0].classList.remove('is-hidden');
        document.getElementsByClassName('l-settings-icon')[0].classList.add('is-visible');
    }

    /**
     * не залогинен
     */
    renderNotLogged() {
        document.getElementById('login-link').classList.remove('is-hidden');
        document.getElementById('login-link').classList.add('is-visible');
        document.getElementById('signup-link').classList.remove('is-hidden');
        document.getElementById('signup-link').classList.add('is-visible');
        document.getElementById('logout-link').classList.remove('is-visible');
        document.getElementById('logout-link').classList.add('is-hidden');
        document.getElementById('profile-link').classList.remove('is-visible');
        document.getElementById('profile-link').classList.add('is-hidden');
        document.getElementsByClassName('l-settings-icon')[0].classList.remove('is-visible');
        document.getElementsByClassName('l-settings-icon')[0].classList.add('is-hidden');
    }
}
