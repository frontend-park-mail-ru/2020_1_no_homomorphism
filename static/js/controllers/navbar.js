import {EventBus} from '../eventBus.js'
import {NavbarModel} from '../models/navbar.js'
import {NavbarView} from '../views/navbar.js'

/**
 * Контроллер для навбара
 */
export class IndexController {
    constructor() {
        this.eventBus = new EventBus();
        this.model = new IndexModel(this.eventBus);
        this.view = new IndexView(this.eventBus);
    }
}
