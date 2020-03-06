import {Api} from '../modules/api.js';

/**
 * Модель для главной странице
 */
export class IndexModel {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('cookie fetch request', this.cookieFetch.bind(this));
    }

    /**
     * Проверка, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieFetch()
            .then((res) => {
                this.eventBus.emit('cookie fetch response', res.ok);
            });
    }
}
