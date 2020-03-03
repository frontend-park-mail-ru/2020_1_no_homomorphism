import {EventBus} from '../eventBus.js'
import {NavbarModel} from '../models/navbar.js'
import {NavbarView} from '../views/navbar.js'

/**
 * Контроллер для навбара
 */
export class NavbarController {
    /**
     * Конструктор
     * @param router {Router}
     * @param globalEventBus {EventBus}
     */
    constructor(router, globalEventBus) {
        this.eventBus = new EventBus();
        this.globalEventBus = globalEventBus;
        this.model = new NavbarModel(this.eventBus);
        this.view = new NavbarView(this.eventBus);

        this.eventBus.on('logout', this.model.logout);
    }
}
