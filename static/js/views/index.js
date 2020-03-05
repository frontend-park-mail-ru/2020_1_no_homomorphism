/**
 *  вью для навбара
 */
export class IndexView {
    /**
     * @param {EventBus} eventBus
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
            // eslint-disable-next-line no-undef
            root.innerHTML = nunjucks.render('../../../views/index.njk'); // TODO Нужно ли это импортить как-то?
        });
        this.eventBus.emit('cookie fetch request', {});
    }
}
