import {EventBus} from '../eventBus.js';
import {NavbarModel} from '../models/navbar.js';
import {NavbarView} from '../views/navbar.js';

/**
 * Контроллер для навбара
 */
export class NavbarController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} globalEventBus
     */
    constructor(router, globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new NavbarModel(this.eventBus, globalEventBus);
        this.view = new NavbarView(this.eventBus, globalEventBus);

        globalEventBus.on('logout redirect', router.logoutRedirect.bind(router));
        this.eventBus.on('redirect', router.redirect.bind(router));
        this.eventBus.on('no answer', router.redirect.bind(router));
    }
}
