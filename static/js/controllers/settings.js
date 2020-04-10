import EventBus from '@libs/eventBus';
import SettingsModel from '@models/settings';
import SettingsView from '@views/settings/settings';
import {SETTINGS} from '@libs/constans';
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
        this.model = new SettingsModel(this.eventBus, globalEventBus);
        this.view = new SettingsView(this.eventBus);
        this.eventBus.on(SETTINGS.REDIRECT, router.redirect.bind(router));
    }
}
