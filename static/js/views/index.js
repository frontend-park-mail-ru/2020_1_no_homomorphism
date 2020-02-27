export class IndexView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        document.getElementById('logout-button').addEventListener('click', this.eventBus.emit('logout', {}));
    }

    render(root) {
        root.innerHTML = nunjucks.render('../../../views/index.njk');
    }
}
