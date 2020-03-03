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
        this.model = new NavbarModel(this.eventBus, this.globalEventBus);
        this.view = new NavbarView(this.eventBus, this.globalEventBus);

        this.globalEventBus.on('login', this.view.login.bind(this.view));
        this.globalEventBus.on('logout redirect', router.logoutRedirect.bind(router));

        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
        this.eventBus.on('no answer', router.redirectToMain.bind(router));

        this.eventBus.on('get user data', this.model.getUserData.bind(this.model));
        this.eventBus.on('logout', this.model.logout.bind(this.model));
    }
}
