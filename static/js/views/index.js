export class IndexView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    render(root) {
        root.innerHTML = nunjucks.render('../../../views/index.njk') + root.innerHTML;
    }
}
