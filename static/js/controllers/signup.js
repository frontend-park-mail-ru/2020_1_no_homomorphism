import EventBus from '@libs/eventBus.js';
import SignupModel from '@models/signup.js';
import SignupView from '@views/signup/signup.js';
import {SIGN_UP} from '@libs/constans.js';

/**
 * Контроллер для страницы регистрации
 */
export class SignupController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} globalEventBus
     */
    constructor(router, globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new SignupModel(this.eventBus, globalEventBus);
        this.view = new SignupView(this.eventBus);
        this.eventBus.on(SIGN_UP.REDIRECT, router.redirect.bind(router));
    }
}
