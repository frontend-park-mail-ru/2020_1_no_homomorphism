import {Api} from '../libs/api.js';
import * as C from '../libs/constans.js';

/**
 * Модель для навбара
 */
export class NavbarModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(C.GET_USER_DATA, this.getUserData.bind(this));
        this.eventBus.on(C.RENDER_NOT_LOGGED, this.logout.bind(this));
        this.eventBus.on(C.CHECK_COOKIE, this.cookieFetch.bind(this));
    }

    /**
     * Узнаёт, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieFetch()
            .then((res) => this.eventBus.emit(C.DRAW_COOKIE_RESULT, res.ok));
    }

    /**
     * Разлогинивает пользователя
     */
    logout() {
        Api.logoutFetch(); // TODO обработать ответ
    }

    /**
     * Получает данные пользователя
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(C.REDIRECT, C.URL_MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(C.RENDER_LOGGED, data);
                        });
                }
            });
    }
}
