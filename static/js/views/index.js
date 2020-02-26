export class IndexView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    render(root) {
        root.innerHTML = nunjucks.render('index');
    }
}
