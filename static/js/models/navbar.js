import {Api} from '../libs/api.js';

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
        this.eventBus.on('get user data', this.getUserData.bind(this));
        this.eventBus.on('logout', this.logout.bind(this));
        this.eventBus.on('cookie fetch', this.cookieFetch.bind(this));
    }

    /**
     * Узнаёт, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieFetch()
            .then((res) => this.eventBus.emit('cookie', res.ok));
    }

    /**
     * Разлогинивает пользователя
     */
    logout() {
        Api.logoutFetch();
    }

    /**
     * Получает данные пользователя
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    console.log('NO ANSWER FROM BACKEND');
                    this.eventBus.emit('redirect', '/');
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit('user data', data);
                        });
                }
            });
    }
}
