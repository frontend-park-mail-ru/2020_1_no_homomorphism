import EventBus from '@libs/eventBus';
import SignupModel from '@models/signup';
import SignupView from '@views/signup/signup';

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
        this.model = new SignupModel(this.eventBus);
        this.view = new SignupView(this.eventBus);
    }
}
