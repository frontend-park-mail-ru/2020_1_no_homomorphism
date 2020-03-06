/**
 * вью для профиля
 */
export class ProfileView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
        this.eventBus.on('user data', this.prerender.bind(this));
        this.eventBus.on('cookie fetch response', this.renderWithCookie.bind(this));
        this.eventBus.emit('get user data', {});
    }

    /**
     * Рендер
     * @param {Object} root
     */
    render(root) {
        this.eventBus.on('user data', (data) => {
            // eslint-disable-next-line no-undef
            root.innerHTML = nunjucks.render('../../../views/profile.njk', data);
        });
        this.eventBus.emit('get user data', {});
    }
}
