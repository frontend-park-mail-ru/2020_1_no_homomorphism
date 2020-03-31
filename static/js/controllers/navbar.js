import EventBus from '@libs/eventBus.js';
import NavbarModel from '@models/navbar.js';
import NavbarView from '@views/navbar/navbar.js';
import {NAVBAR} from '@libs/constans.js';
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

        globalEventBus.on(NAVBAR.LOGOUT_REDIRECT, router.logoutRedirect.bind(router));
        this.eventBus.on(NAVBAR.REDIRECT, router.redirect.bind(router));
        this.eventBus.on(NAVBAR.NO_ANSWER, router.redirect.bind(router));
    }
}
