import {EventBus} from '../eventBus.js'
import {LoginModel} from '../models/login.js'
import {LoginView} from '../views/login.js'

/**
 * Контроллер для страницы со входом
 */
export class LoginController {
    /**
     * Конструктор
     * @param router {Router}
     * @param globalEventBus {EventBus}
     */
    constructor(router, globalEventBus) {
        this.eventBus = new EventBus();
        this.globalEventBus = globalEventBus;
        this.model = new LoginModel(this.eventBus, this.globalEventBus);
        this.view = new LoginView(this.eventBus);
        this.eventBus.on('submit', this.model.submit.bind(this));
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
    }
}
