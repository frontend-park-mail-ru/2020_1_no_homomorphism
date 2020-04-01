import {NAVBAR, DOM} from '@libs/constans.js';
import navbar from '@views/navbar/navbar.tmpl.xml';
import BaseView from '@libs/base_view';

/**
 *  вью для навбара
 */
export default class NavbarView extends BaseView {
    /**
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        super(navbar);
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.globalEventBus.on(NAVBAR.LOGIN_SUCCESS, this.renderLogin.bind(this));
        this.eventBus.on(NAVBAR.DRAW_COOKIE_RESULT, this.analyzeCookie.bind(this));
        this.firstRender = true;
    }

    /**
     * рендерит навбар
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.NAVBAR)[0]);
        if (this.firstRender) {
            this.setEventListeners.bind(this)();
        }
        this.eventBus.emit(NAVBAR.CHECK_COOKIE, {});
    }

    /**
     * Sets event listeners
     */
    setEventListeners() {
        // this.eventBus.on(NAVBAR.DRAW_COOKIE_RESULT, (loggedIn) => {
        //     if (loggedIn) {
        //         this.login();
        //     } else {
        //         this.logout();
        //     }
        // });
        // document.getElementById('logout-link').addEventListener('click', this.renderLogout.bind(this));
        document.getElementById('logout-link').addEventListener('click', this.logoutClicked.bind(this));
        this.firstRender = false;
    }
    /**
     * не залогинен
     */
    logoutClicked() {
        this.eventBus.emit(NAVBAR.LOGOUT_CLICKED, {});
        this.renderLogout.bind(this)();
        this.globalEventBus.emit(NAVBAR.LOGOUT_REDIRECT, URL.MAIN);
    }

    /**
     * Залогинен
     * @param {boolean} loggedIn
     */
    analyzeCookie(loggedIn) {
        if (loggedIn) {
            this.renderLogin.bind(this)();
            // this.eventBus.emit(NAVBAR.GET_USER_DATA, {});
        } else {
            this.renderLogout.bind(this)();
        }
    }

    /**
     * Залогинен
     */
    renderLogin() {
        this.eventBus.on(NAVBAR.RENDER_LOGGED, (data) => {
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
        });
        this.eventBus.emit(NAVBAR.GET_USER_DATA, {});
    }

    /**
     * не залогинен
     */
    renderLogout() {
        document.getElementById('login-link').classList.remove('is-hidden');
        document.getElementById('login-link').classList.add('is-visible');
        document.getElementById('signup-link').classList.remove('is-hidden');
        document.getElementById('signup-link').classList.add('is-visible');
        document.getElementById('logout-link').classList.remove('is-visible');
        document.getElementById('logout-link').classList.add('is-hidden');
        document.getElementById('profile-link').classList.remove('is-visible');
        document.getElementById('profile-link').classList.add('is-hidden');
    }
}
