import EventBus from '@libs/eventBus';
import LoginModel from '@models/login';
import LoginView from '@views/login/login';

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
    }
}
