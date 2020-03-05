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
        this.eventBus.on('cookie fetch response', this.renderWithCookie.bind(this));
        this.eventBus.emit('get user data', {});
    }

    /**
     * рендерит страничку с профилем
     * @param root
     */
    render(root) {
        this.root = root;
        this.eventBus.emit('cookie fetch request', {});
    }
    renderWithCookie(loggedIn) {
        if (loggedIn) {
            document.getElementById('profile-link').style.visibility = 'visible';
            document.getElementById('logout-button').style.visibility = 'visible';
            document.getElementById('signup-link').style.visibility = 'hidden';
            document.getElementById('login-link').style.visibility = 'hidden';
        } else {
            document.getElementById('signup-link').style.visibility = 'visible';
            document.getElementById('login-link').style.visibility = 'visible';
            document.getElementById('profile-link').style.visibility = 'hidden';
        }
        this.root.innerHTML = this.template;
    }

    prerender(data) {
        this.template = nunjucks.render('../../../views/profile.njk', data);
    }
}
