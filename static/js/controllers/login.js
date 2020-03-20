import {EventBus} from '../libs/eventBus.js';
import {LoginModel} from '../models/login.js';
import {LoginView} from '../views/login.js';
import * as C from '../libs/constans.js';
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
        this.model = new LoginModel(this.eventBus, globalEventBus);
        this.view = new LoginView(this.eventBus);
        this.eventBus.on(C.REDIRECT, router.redirect.bind(router));
    }
}
