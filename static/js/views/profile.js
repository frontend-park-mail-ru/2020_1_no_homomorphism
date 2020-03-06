/**
 * вью для профиля
 */
export class ProfileView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('user data', this.prerender.bind(this));
        this.eventBus.emit('get user data', {});
    }

    /**
     * Рендер
     * @param {Object} root
     */
    render(root) {
        root.innerHTML = this.template;
    }

    /**
     * Получает данные пользователя
     * @param {Object} data
     */
    prerender(data) {
        // eslint-disable-next-line no-undef
        this.template = nunjucks.render('../../../views/profile.njk', data);
    }
}
