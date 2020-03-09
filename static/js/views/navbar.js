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
        this.globalEventBus.on('login', this.login.bind(this));
    }

    /**
    * рендерит навбар
    * @param {bool} loggedIn
    */
    render(loggedIn) {
        document.getElementById('profile-link').style.visibility =
            loggedIn ? 'visible' : 'hidden';
        document.getElementById('logout-button').style.visibility =
            loggedIn ? 'visible' : 'hidden';
        document.getElementById('signup-link').style.visibility = loggedIn ? 'hidden' : 'visible';
        document.getElementById('login-link').style.visibility = loggedIn ? 'hidden' : 'visible';
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
        this.eventBus.on('user data', (data) => {
            document.getElementById('profile-link').innerHTML =
                // eslint-disable-next-line no-undef
                nunjucks.render('../../../views/templates/profileLink.njk', data);
            document.getElementById('login-link').style.visibility = 'hidden';
            document.getElementById('signup-link').style.visibility = 'hidden';
            document.getElementById('logout-button').style.visibility = 'visible';
            document.getElementById('profile-link').style.visibility = 'visible';
        });
        this.eventBus.emit('get user data', {});
    }

    /**
     * рисует кнопочку логаута
     */
    logout() {
        this.eventBus.emit('logout', {});
        document.getElementById('login-link').style.visibility = 'visible';
        document.getElementById('signup-link').style.visibility = 'visible';
        document.getElementById('logout-button').style.visibility = 'hidden';
        document.getElementById('profile-link').style.visibility = 'hidden';
        this.globalEventBus.emit('logout redirect', '/');
    }
}
