import {EventBus} from '../libs/eventBus.js';
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
        this.eventBus.on('redirect', router.redirect.bind(router));
        this.eventBus.on('no answer', router.redirect.bind(router));
    }
}
