import {EventBus} from '../eventBus.js'
import {IndexModel} from '../models/index.js'
import {IndexView} from '../views/index.js'

export class IndexController {
    constructor(globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new IndexModel(this.eventBus);
        this.view = new IndexView(this.eventBus);
        this.globalEventBus = globalEventBus;

        this.globalEventBus.on('jump to /', this.load);
    }

    load() {
        this.view.render();
    }
};
