import EventBus from '@libs/eventBus';
import NavbarModel from '@models/navbar';
import NavbarView from '@views/navbar/navbar';
import {NAVBAR} from '@libs/constans';
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
    }
}
