import {Api} from '../modules/api.js';

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
                    this.eventBus.emit('redirect to main', 'Ошибка загрузки профиля');
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit('user data', data);
                        });
                } else {
                    this.eventBus.emit('no answer', 'Ошибка загрузки профиля');
                }
            });
    }
}
