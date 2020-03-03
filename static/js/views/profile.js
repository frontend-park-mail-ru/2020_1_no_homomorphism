/**
 * вью для профиля
 */
export class ProfileView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    showErrors(error) {
        console.log('INPUT ERROR ');
    }

    /**
     * рендерит страничку с профилем
     * @param root
     */
    render(root, loggedIn) {
        if (loggedIn) {
            document.getElementById('profile-link').style.display = 'block';
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('signup-link').style.display = 'none';
            document.getElementById('login-link').style.display = 'none';
        } else {
            document.getElementById('signup-link').style.display = 'block';
            document.getElementById('login-link').style.display = 'block';
            document.getElementById('profile-link').style.display = 'none';
            document.getElementById('logout-button').style.display = 'none';
        }
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/profile.njk', data);
        });
        this.eventBus.emit('get user data', {});
    }
}
