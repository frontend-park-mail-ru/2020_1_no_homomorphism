import Api from '@libs/api';
import {RESPONSE, NAVBAR, URL} from '@libs/constans';
// import {setToken} from '@libs/user';
import {User} from '@libs/user';

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
        this.globalEventBus.on(NAVBAR.GET_USER_DATA, this.getUserData.bind(this));
        this.eventBus.on(NAVBAR.GET_USER_DATA, this.getUserData.bind(this));
        this.eventBus.on(NAVBAR.LOGOUT_CLICKED, this.doLogout.bind(this));
        this.eventBus.on(NAVBAR.CHECK_COOKIE, this.cookieFetch.bind(this));
    }

    /**
     * Узнаёт, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                case RESPONSE.UNAUTH:
                    this.eventBus.emit(NAVBAR.DRAW_COOKIE_RESULT, res.ok);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Разлогинивает пользователя
     */
    doLogout() {
        Api.logoutFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    User.clean();
                    break;
                case RESPONSE.BAD_REQUEST:
                case RESPONSE.UNAUTH:
                    this.cookieFetch.bind(this)();
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
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(NAVBAR.RENDER_LOGGED, data);
                        });
                    break;
                case RESPONSE.UNAUTH:
                    this.eventBus.emit(NAVBAR.RENDER_NOT_LOGGED, {});
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(NAVBAR.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
