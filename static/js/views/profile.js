/**
 * вью для профиля
 */
export class ProfileView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
        this.eventBus.on('user data', this.prerender.bind(this));
        this.eventBus.emit('get user data', {});
    }

    /**
     * рендерит страничку с профилем
     * @param root
     */
    render(root) {
        this.eventBus.on('cookie fetch response', (loggedIn) => {
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
            root.innerHTML = this.template;
        });
        this.eventBus.emit('cookie fetch request', {});
    }

    prerender(data) {
        this.template = nunjucks.render('../../../views/profile.njk', data);
    }
}
