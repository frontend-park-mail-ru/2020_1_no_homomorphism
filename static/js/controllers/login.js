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
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new LoginModel(this.eventBus);
        this.view = new LoginView(this.eventBus);

        this.eventBus.on('submit', this.model.submit.bind(this));
        this.eventBus.on('remember changed', this.model.changeRemember);
        this.eventBus.on('invalid', this.view.showErrors);
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
        this.eventBus.on('hide login, show logout', this.view.hideLoginShowLogout);
    }
}
