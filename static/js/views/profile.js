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
    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/profile.njk', data);
        });
        this.eventBus.emit('get user data', {});
    }
}
