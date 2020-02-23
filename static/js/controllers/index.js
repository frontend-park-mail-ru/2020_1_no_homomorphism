import {IndexModel} from '../models/index.js'
import {IndexView} from '../views/index.js'

export class IndexController {
    constructor(eventBus/*, globalEventBus*/) {
        this.model = new IndexModel(eventBus, {}),
        this.view = new IndexView(eventBus, {}),
        this.eventBus = eventBus;
        //this.globalEventBus = globalEventBus;
    }
};
