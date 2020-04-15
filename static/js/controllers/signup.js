import EventBus from '@libs/eventBus';
import SignupModel from '@models/signup';
import SignupView from '@views/signup/signup';
import {SIGN_UP} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

/**
 * Контроллер для страницы регистрации
 */
export class SignupController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new SignupModel(this.eventBus, globalEventBus);
        this.view = new SignupView(this.eventBus, globalEventBus);
        this.eventBus.on(SIGN_UP.REDIRECT, router.redirect.bind(router));
    }
}
