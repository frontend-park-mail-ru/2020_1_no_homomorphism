import {EventBus} from '../eventBus.js'
import {IndexModel} from '../models/index.js'
import {IndexView} from '../views/index.js'

export class IndexController {
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new IndexModel(this.eventBus);
        this.view = new IndexView(this.eventBus);

        this.eventBus.on('logout', this.model.logout);
    }
}
