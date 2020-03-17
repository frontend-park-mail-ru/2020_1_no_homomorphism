import {EventBus} from '../libs/eventBus.js';
import {SettingsModel} from '../models/settings.js';
import {SettingsView} from '../views/settings.js';

/**
 * Контроллер для страницы редактирования данных пользователя
 */
export class SettingsController {
    /**
     * Конструктор
     * @param {Router} router
     *  @param {EventBus} globalEventBus
     */
    constructor(router, globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new SettingsModel(this.eventBus);
        this.view = new SettingsView(this.eventBus);
        this.eventBus.on('redirect', router.redirect.bind(router));
    }
}
