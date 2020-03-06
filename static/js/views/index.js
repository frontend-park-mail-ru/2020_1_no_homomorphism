/**
 *  вью для главной
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
    * @param {Object} root
    */
    render(root) {
        // eslint-disable-next-line no-undef
        root.innerHTML = nunjucks.render('../../../views/index.njk');
    }
}
