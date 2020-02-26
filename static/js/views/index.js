import template from '../../views/index.njk';

export class IndexView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    render(root) {
        root.innerHTML = template;
    }
}
