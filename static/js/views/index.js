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
        root.innerHTML = nunjucks.render('../../../views/index.njk');
    }
}
