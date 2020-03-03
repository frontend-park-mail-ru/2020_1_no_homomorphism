/**
 *  вью для главной страницы
 */
export class IndexView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    /**
    * рендерит главную страничку
    * @param root {Object}
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
        root.innerHTML = nunjucks.render('../../../views/index.njk');
    }
}
