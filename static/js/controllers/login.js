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
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new LoginModel(this.eventBus);
        this.view = new LoginView(this.eventBus);
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
    }
}
