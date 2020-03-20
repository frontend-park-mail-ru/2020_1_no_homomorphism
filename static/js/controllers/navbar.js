import {EventBus} from '../libs/eventBus.js';
import {NavbarModel} from '../models/navbar.js';
import {NavbarView} from '../views/navbar.js';
import * as C from '../libs/constans.js';
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

        globalEventBus.on(C.LOGOUT_REDIRECT, router.logoutRedirect.bind(router));
        this.eventBus.on(C.REDIRECT, router.redirect.bind(router));
        this.eventBus.on(C.NO_ANSWER, router.redirect.bind(router));
    }
}
