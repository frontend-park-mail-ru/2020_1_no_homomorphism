import {EventBus} from '../eventBus.js';
import {LoginModel} from '../models/login.js';
import {LoginView} from '../views/login.js';

/**
 * Контроллер для страницы со входом
 */
export class LoginController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} globalEventBus
     */
    constructor(router, globalEventBus) {
        this.eventBus = new EventBus();
        this.globalEventBus = globalEventBus;
        this.model = new LoginModel(this.eventBus, this.globalEventBus);
        this.view = new LoginView(this.eventBus);
        this.eventBus.on('redirect', router.redirect.bind(router));
    }
}
