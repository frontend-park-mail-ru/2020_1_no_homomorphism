import {EventBus} from '../eventBus.js'
import {SettingsModel} from '../models/settings.js'
import {SettingsView} from '../views/settings.js'

/**
 * Контроллер для страницы редактирования данных пользователя
 */
export class SettingsController {
    /**
     * Конструктор
     * @param router {Router}
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new SettingsModel(this.eventBus);
        this.view = new SettingsView(this.eventBus);
        this.eventBus.on('invalid', this.view.showErrors);
        this.eventBus.on('avatar upload', this.model.resetAvatar.bind(this));
        this.eventBus.on('submit', this.model.submit.bind(this));
        this.eventBus.on('get user data', this.model.getUserData.bind(this));
        //this.eventBus.on('add outer', this.model.addOuter);
        this.eventBus.on('redirect', router.redirect.bind(router));
    }
}
