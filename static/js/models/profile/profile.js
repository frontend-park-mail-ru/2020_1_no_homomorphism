import Api from '@libs/api.js';
import {PROFILE, URL} from '@libs/constans.js';
import {NAVBAR, RESPONSE} from '@libs/constans';

/**
 * Модель Профиля
 */
export default class ProfileModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(PROFILE.GET_DATA, this.getUserData.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(PROFILE.RENDER_DATA, data);
                        });
                    break;
                case RESPONSE.UNAUTH:
                    this.globalEventBus.emit(NAVBAR.GET_USER_DATA, {});
                    this.eventBus.emit(PROFILE.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(PROFILE.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
