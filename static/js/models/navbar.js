import Api from '@libs/api.js';
import {NAVBAR, URL} from '@libs/constans.js';
import {LOGIN, RESPONSE} from '@libs/constans';

/**
 * Модель для навбара
 */
export default class NavbarModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(NAVBAR.GET_USER_DATA, this.getUserData.bind(this));
        this.globalEventBus.on(NAVBAR.GET_USER_DATA, this.getUserData.bind(this));
        this.eventBus.on(NAVBAR.LOGOUT_CLICKED, this.doLogout.bind(this));
        this.eventBus.on(NAVBAR.CHECK_COOKIE, this.cookieFetch.bind(this));
    }

    /**
     * Узнаёт, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieFetch()
            .then((res) => this.eventBus.emit(NAVBAR.DRAW_COOKIE_RESULT, res.ok));
    }

    /**
     * Разлогинивает пользователя
     */
    doLogout() {
         Api.logoutFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    break;
                case RESPONSE.BAD_REQUEST:
                    // Не получилось распарсить
                    break;
                case RESPONSE.UNAUTH:
                    // TODO Пользователь не залогинен
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получает данные пользователя
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(NAVBAR.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(NAVBAR.RENDER_LOGGED, data);
                        });
                }
            });
    }
}
