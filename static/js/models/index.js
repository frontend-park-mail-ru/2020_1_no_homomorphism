import {Api} from "../modules/api.js";

/**
 * Модель для главной страницы
 */
export class IndexModel {
    /**
     * Конструктор
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
}
