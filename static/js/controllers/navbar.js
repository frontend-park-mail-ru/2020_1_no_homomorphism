import EventBus from '@libs/eventBus';
import NavbarModel from '@models/navbar';
import NavbarView from '@views/navbar/navbar';
import {NAVBAR} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

/**
 * Контроллер для навбара
 */
export class NavbarController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new NavbarModel(this.eventBus);
        this.view = new NavbarView(this.eventBus);

        globalEventBus.on(NAVBAR.LOGOUT_REDIRECT, router.logoutRedirect.bind(router));
    }
}
