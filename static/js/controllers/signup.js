import {EventBus} from '../eventBus.js';
import {SignupModel} from '../models/signup.js';
import {SignupView} from '../views/signup.js';

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
        this.globalEventBus = globalEventBus;
        this.model = new SignupModel(this.eventBus, this.globalEventBus);
        this.view = new SignupView(this.eventBus);
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
    }
}
