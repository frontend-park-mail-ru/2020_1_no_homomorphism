import {EventBus} from '../eventBus.js';
import {ProfileModel} from '../models/profile.js';
import {ProfileView} from '../views/profile.js';

/**
 * Контроллер для профиля
 */
export class ProfileController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new ProfileModel(this.eventBus);
        this.view = new ProfileView(this.eventBus);
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
        this.eventBus.on('no answer', router.redirectToMain.bind(router));
    }
}
