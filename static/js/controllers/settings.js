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

        this.eventBus.on('avatar upload', this.model.resetAvatar);
        this.eventBus.on('submit', this.model.submit);
        //this.eventBus.on('add outer', this.model.addOuter);
        this.eventBus.on('redirect to main', router.redirectToMain);


    }
}
