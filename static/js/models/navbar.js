import Api from '@libs/api';
import {RESPONSE, NAVBAR, URL, GLOBAL} from '@libs/constants';
import User from '@libs/user';
import {globalEventBus} from '@libs/eventBus';

/**
 * Модель для навбара
 */
export default class NavbarModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        globalEventBus.on(NAVBAR.GET_USER_DATA, this.getUserData.bind(this));
        this.eventBus.on(NAVBAR.GET_USER_DATA, this.getUserData.bind(this));
        this.eventBus.on(NAVBAR.LOGOUT_CLICKED, this.doLogout.bind(this));
        this.eventBus.on(NAVBAR.CHECK_COOKIE, this.cookieFetch.bind(this));
    }

    /**
     * Узнаёт, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieGet()
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
        // console.log('GETTTTTTTTTTTTt');
        Api.profileGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            User.setUserData(data);
                            console.log(User.exists());
                            this.eventBus.emit(NAVBAR.RENDER_LOGGED, data);
                        });
                    break;
                case RESPONSE.UNAUTH:
                    this.eventBus.emit(NAVBAR.RENDER_NOT_LOGGED, {});
                    break;
                case RESPONSE.SERVER_ERROR:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
