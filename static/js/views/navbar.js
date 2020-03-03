/**
 *  вью для навбара
 */
export class NavbarView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    /**
    * рендерит навбар
    * @param loggedIn {bool}
    */
    render(loggedIn) {
        if (loggedIn) {
            document.getElementById('profile-link').style.visibility = 'visible';
            document.getElementById('logout-button').style.visibility = 'visible';
            document.getElementById('signup-link').style.visibility = 'hidden';
            document.getElementById('login-link').style.visibility = 'hidden';
        } else {
            document.getElementById('signup-link').style.visibility = 'visible';
            document.getElementById('login-link').style.visibility = 'visible';
            document.getElementById('profile-link').style.visibility = 'hidden';
            document.getElementById('logout-button').style.visibility = 'hidden';
        }
    }
    setEventListeners() {
        document.getElementById('logout-button').addEventListener('click', this.logout);
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
    }
}
