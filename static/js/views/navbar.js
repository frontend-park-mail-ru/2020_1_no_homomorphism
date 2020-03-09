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
    render() {
        this.eventBus.on('cookie', (loggedIn) => {
            loggedIn ? this.login() : this.logout();
        });
        this.eventBus.emit('cookie fetch');
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
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('signup-link').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('profile-link').style.display = 'block';
        });
        this.eventBus.emit('get user data');
    }

    /**
     * рисует кнопочку логаута
     */
    logout() {
        this.eventBus.emit('logout');
        document.getElementById('login-link').style.display = 'block';
        document.getElementById('signup-link').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('profile-link').style.display = 'none';
        this.globalEventBus.emit('logout redirect', '/');
    }
}
