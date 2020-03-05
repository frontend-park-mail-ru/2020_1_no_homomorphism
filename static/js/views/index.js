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
            root.innerHTML = nunjucks.render('../../../views/index.njk');
        });
        this.eventBus.emit('cookie fetch request', {});
    }
}
