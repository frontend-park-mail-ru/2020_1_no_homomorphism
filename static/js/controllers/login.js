import EventBus from '@libs/eventBus';
import LoginModel from '@models/login';
import LoginView from '@views/login/login';
import {LOGIN} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

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
        this.model = new LoginModel(this.eventBus, globalEventBus);
        this.view = new LoginView(this.eventBus, globalEventBus);
        this.eventBus.on(LOGIN.REDIRECT, router.redirect.bind(router));
    }
}
