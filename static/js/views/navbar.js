import * as C from '../libs/constans.js';
/**
 *  вью для навбара
 */
export class NavbarView {
    /**
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.globalEventBus.on(C.LOGIN_SUCCESS, this.login.bind(this));
    }

    /**
     * рендерит навбар
     */
    render() {
        this.eventBus.on(C.DRAW_COOKIE_RESULT, (loggedIn) => {
            if (loggedIn) {
                this.login();
            } else {
                this.logout();
            }
        });
        this.eventBus.emit(C.CHECK_COOKIE, {});
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
        this.eventBus.on(C.RENDER_LOGGED, (data) => {
            document.getElementById('profile-link').innerHTML =
                // eslint-disable-next-line no-undef
                nunjucks.render('../../../views/templates/profileLink.njk', data);
            document.getElementById('login-link').style.visibility = 'hidden';
            document.getElementById('signup-link').style.visibility = 'hidden';
            document.getElementById('logout-button').style.visibility = 'visible';
            document.getElementById('profile-link').style.visibility = 'visible';
        });
        this.eventBus.emit(C.GET_USER_DATA, {});
    }

    /**
     * рисует кнопочку логаута
     */
    logout() {
        this.eventBus.emit(C.RENDER_NOT_LOGGED, {});
        document.getElementById('login-link').style.visibility = 'visible';
        document.getElementById('signup-link').style.visibility = 'visible';
        document.getElementById('logout-button').style.visibility = 'hidden';
        document.getElementById('profile-link').style.visibility = 'hidden';
        this.globalEventBus.emit(C.LOGOUT_REDIRECT, '/');
    }
}
