import {NAVBAR} from '../libs/constans.js';

/**
 *  вью для навбара
 */
export default class NavbarView {
    /**
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.globalEventBus.on(NAVBAR.LOGIN_SUCCESS, this.login.bind(this));
    }

    /**
     * рендерит навбар
     */
    render() {
        this.eventBus.on(NAVBAR.DRAW_COOKIE_RESULT, (loggedIn) => {
            if (loggedIn) {
                this.login();
            } else {
                this.logout();
            }
        });
        this.eventBus.emit(NAVBAR.CHECK_COOKIE, {});
    }

    /**
     * Sets event listeners
     */
    setEventListeners() {
        document.getElementById('logout-button').addEventListener('click', this.logout.bind(this));
    }

    /**
     * Реагирует на логин
     */
    login() {
        this.eventBus.on(NAVBAR.RENDER_LOGGED, (data) => {
            document.getElementById('profile-link').innerHTML =
                // eslint-disable-next-line no-undef
                nunjucks.render('../../../views/templates/profileLink.njk', data);
            document.getElementById('login-link').style.visibility = 'hidden';
            document.getElementById('signup-link').style.visibility = 'hidden';
            document.getElementById('logout-button').style.visibility = 'visible';
            document.getElementById('profile-link').style.visibility = 'visible';
        });
        this.eventBus.emit(NAVBAR.GET_USER_DATA, {});
    }

    /**
     * рисует кнопочку логаута
     */
    logout() {
        this.eventBus.emit(NAVBAR.RENDER_NOT_LOGGED, {});
        document.getElementById('login-link').style.visibility = 'visible';
        document.getElementById('signup-link').style.visibility = 'visible';
        document.getElementById('logout-button').style.visibility = 'hidden';
        document.getElementById('profile-link').style.visibility = 'hidden';
        this.globalEventBus.emit(NAVBAR.LOGOUT_REDIRECT, '/');
    }
}
