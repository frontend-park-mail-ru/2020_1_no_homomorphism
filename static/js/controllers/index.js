import {EventBus} from '../eventBus.js'
import {IndexModel} from '../models/index.js'
import {IndexView} from '../views/index.js'

export class IndexController {
    constructor(baseTemplate) {
        this.eventBus = new EventBus();
        this.model = new IndexModel(this.eventBus);
        this.view = new IndexView(baseTemplate, this.eventBus);
    }
};
