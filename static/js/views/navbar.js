/**
 *  вью для навбара
 */
export class NavbarView {
    /**
     * @param eventBus {EventBus}
     * @param globalEventBus {EventBus}
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
    }

    /**
    * рендерит навбар
    * @param loggedIn {bool}
    */
    render(loggedIn) {
        document.getElementById('profile-link').style.visibility = (loggedIn ? 'visible' : 'hidden');
        document.getElementById('logout-button').style.visibility = (loggedIn ? 'visible' : 'hidden');
        document.getElementById('signup-link').style.visibility = (loggedIn ? 'hidden' : 'visible');
        document.getElementById('login-link').style.visibility = (loggedIn ? 'hidden' : 'visible');
    }
    setEventListeners() {
        document.getElementById('logout-button').addEventListener('click', this.logout);
    }

    login() {
        this.eventBus.on('user data', (data) => {
            document.getElementById('profile-link').innerHTML = nunjucks.render('../../../views/templates/profileLink.njk', data);
        });
        this.eventBus.emit('get user data', {});
    }

    /**
     * рисует кнопочку логаута
     */
    logout() {
        this.eventBus.emit('logout', {});
        this.globalEventBus.emit('logout redirect', '/');
        document.getElementById('login-link').style.visibility = 'visible';
        document.getElementById('signup-link').style.visibility = 'visible';
        document.getElementById('logout-button').style.visibility = 'hidden';
        document.getElementById('profile-link').style.visibility = 'hidden';
    }
}
