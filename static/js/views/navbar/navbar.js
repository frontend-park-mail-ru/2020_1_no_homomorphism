import {NAVBAR, GLOBAL, DOM, URL, THEME, LAYOUT} from '@libs/constants';
import navbar from '@views/navbar/navbar.tmpl.xml';
import BaseView from '@libs/base_view';
import User from '@libs/user';
import SearchComponent from '@components/search/search';
import {globalEventBus} from '@libs/eventBus';
import {inputSanitize} from '@libs/input_sanitize';
import {setLanguage} from '@libs/language';

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
        globalEventBus.on(GLOBAL.RENDER_THEME, this.renderTheme.bind(this));
        globalEventBus.on(GLOBAL.RENDER_LOGGED, this.renderLogged.bind(this));
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
        this.eventBus.emit(NAVBAR.CHECK_COOKIE);
        this.renderTheme();
        this.renderLanguage();
        this.setEventListeners();
    }

    /**
     * Рендерит тему
     */
    renderTheme() {
        if (User.exists()) {
            window.localStorage.setItem('theme', User.getUserData().theme);
        }
        if (window.localStorage.getItem('theme') === null) {
            window.localStorage.setItem('theme', 'dark green');
        }
        const split = window.localStorage.getItem('theme').split(' ');

        document.documentElement.setAttribute('theme', split[0]);
        if (split[0] === 'special') {
            document.documentElement.setAttribute('theme-name', split[1]);
        } else {
            document.documentElement.removeAttribute('theme-name');
        }
        THEME[split[0]][split[1]].forEach((prop) => {
            document.documentElement.style.setProperty(prop[0], prop[1]);
        });
    }

    /**
     * Рендерит язык
     */
    renderLanguage() {
        if (User.exists()) {
            setLanguage(User.getUserData().lang);
        } else if (window.localStorage.getItem('lang')) {
            setLanguage(window.localStorage.getItem('lang'));
        }
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
            if (event.target.classList.contains('m-search-icon')) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.submit(document.getElementsByClassName('m-search-input')[0].value);
            }
        });
        document.addEventListener('click', this.closeSearchComponent.bind(this));
        document.getElementsByClassName('l-navbar-small-search')[0]
            .addEventListener('click', this.renderSearch.bind(this));
        document.getElementsByClassName('l-navbar-icon').forEach((icon) => {
            icon.addEventListener('touchend', (event) => {
                event.preventDefault();
                icon.classList.add('touched');
                setTimeout(() => {
                    icon.classList.remove('touched');
                }, 100);
                icon.click();
            });
        });
        document.getElementsByClassName('l-logo')[0].addEventListener('touchend', (event) => {
            event.preventDefault();
            event.target.click();
        });
        window.addEventListener('orientationchange', this.closeSearch.bind(this));
        window.addEventListener('resize', this.closeSearch.bind(this));
        window.addEventListener('click', (event) => {
            const dropdown = document.getElementsByClassName('m-dropdown').find((elem) => {
                return elem.classList.contains('is-expanded');
            });
            if (dropdown && !dropdown.contains(event.target)) {
                dropdown.classList.remove('is-expanded');
            }
        });
        window.addEventListener('scroll', (event) => {
            document.getElementsByClassName('m-dropdown').forEach((elem) => {
                elem.classList.remove('is-expanded');
            });
        });
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
    }

    /**
     * Закрытие секции
     * @param {Object} event
     */
    closeSearchComponent(event) {
        const topContent = document.getElementsByClassName('l-top-content')[0];
        const searchInput = document.getElementsByClassName('m-search-input')[0];
        const isClickInside = (topContent.contains(event.target) ||
            searchInput.contains(event.target));
        if (!isClickInside) {
            this.searchComponent.close();
        }
    }

    /**
     * Нажатия на логаут
     */
    logoutClicked() {
        this.loggedIn = false;
        this.eventBus.emit(NAVBAR.LOGOUT_CLICKED);
        this.renderNotLogged.bind(this)();
        globalEventBus.emit(GLOBAL.HIDE_SUBSCRIPTIONS);
        globalEventBus.emit(GLOBAL.LOGOUT_REDIRECT, URL.MAIN);
        globalEventBus.emit(GLOBAL.CLEAR_AND_LOCK);
    }

    /**
     * Проверка куки
     * @param {boolean} loggedIn
     */
    analyzeCookie(loggedIn) {
        this.loggedIn = loggedIn;
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
        document.getElementsByClassName('m-navbar-name')[0].innerHTML = inputSanitize(data.login);
        document.getElementById('login-link').classList.add('is-not-displayed');
        document.getElementById('signup-link').classList.add('is-not-displayed');
        document.getElementById('logout-link').classList.remove('is-not-displayed');
        document.getElementById('profile-link').classList.remove('is-not-displayed');
        document.getElementById('settings-icon').classList.remove('is-not-displayed');
        this.renderLanguage();
        this.renderTheme();
    }

    /**
     * не залогинен
     */
    renderNotLogged() {
        document.getElementById('login-link').classList.remove('is-not-displayed');
        document.getElementById('signup-link').classList.remove('is-not-displayed');
        document.getElementById('logout-link').classList.add('is-not-displayed');
        document.getElementById('profile-link').classList.add('is-not-displayed');
        document.getElementById('settings-icon').classList.add('is-not-displayed');
    }

    /**
     * Рендерит поиск для мобилок
     * @param {Object} event
     */
    renderSearch(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (document.getElementsByClassName('l-navbar-small-search')[0]
            .children[0].src.indexOf('search') !== -1
        ) {
            document.getElementsByClassName('l-navbar')[0].children.forEach((item) => {
                if (item.classList.contains('l-navbar-small-search') ||
                    item.classList.contains('m-search-input')
                ) {
                    return;
                }
                item.classList.add('is-not-displayed');
            });
            document.getElementsByClassName('m-search-input')[0].classList
                .remove('m-desktop-tablet-only');
            document.getElementsByClassName('m-search-input')[0].classList
                .add('m-search-input-expanded');
            document.getElementsByClassName('l-navbar-small-search')[0]
                .children[0].src = '/static/img/icons/clear.svg';
        } else {
            document.getElementsByClassName('l-navbar')[0].children.forEach((item) => {
                if ((item.classList.contains('l-navbar-small-search') ||
                    item.classList.contains('m-search-input') ||
                    (this.loggedIn && (item.getAttribute('id') == 'signup-link' ||
                        item.getAttribute('id') == 'login-link')) ||
                    (!this.loggedIn && (item.getAttribute('id') == 'profile-link' ||
                        item.getAttribute('id') == 'settings-icon' ||
                        item.getAttribute('id') == 'logout-link')))
                ) {
                    return;
                }
                item.classList.remove('is-not-displayed');
            });
            document.getElementsByClassName('m-search-input')[0].classList
                .add('m-desktop-tablet-only');
            document.getElementsByClassName('m-search-input')[0].classList
                .remove('m-search-input-expanded');
            document.getElementsByClassName('l-navbar-small-search')[0]
                .children[0].src = '/static/img/icons/search.svg';
            this.closeSearchComponent({target: document.documentElement});
        }
    }

    /**
     * Закрывает поиск во время orientationchange
     */
    closeSearch() {
        if (window.matchMedia(LAYOUT.MOBILE).matches) {
            return;
        }
        document.getElementsByClassName('l-navbar')[0].children.forEach((item) => {
            if ((item.classList.contains('l-navbar-small-search') ||
                item.classList.contains('m-search-input') ||
                (this.loggedIn && (item.getAttribute('id') == 'signup-link' ||
                    item.getAttribute('id') == 'login-link')) ||
                (!this.loggedIn && (item.getAttribute('id') == 'profile-link' ||
                    item.getAttribute('id') == 'settings-icon' ||
                    item.getAttribute('id') == 'logout-link')))
            ) {
                return;
            }
            item.classList.remove('is-not-displayed');
        });
        document.getElementsByClassName('m-search-input')[0].classList
            .add('m-desktop-tablet-only');
        document.getElementsByClassName('m-search-input')[0].classList
            .remove('m-search-input-expanded');
        document.getElementsByClassName('l-navbar-small-search')[0]
            .children[0].src = '/static/img/icons/search.svg';
        this.closeSearchComponent({target: document.documentElement});
    }
}
