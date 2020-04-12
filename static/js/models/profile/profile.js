import Api from '@libs/api';
import {PROFILE, URL, NAVBAR, RESPONSE} from '@libs/constans';
import User from '@libs/user';


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
        this.user = new User();
        this.eventBus.on(PROFILE.GET_DATA, this.getUserData.bind(this));
        this.eventBus.on(PROFILE.GET_STAT, this.getUserStat.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() {
        console.log('IF  ' + this.user.exists);
        if (this.user.exists) {
            this.eventBus.emit(PROFILE.GET_STAT);
            this.eventBus.emit(PROFILE.RENDER_DATA, this.user.userData);
            return;
        }
        Api.profileFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.user.userData = data;
                            this.eventBus.emit(PROFILE.GET_STAT);
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

    /**
     * получает статистику юзера
     */
    getUserStat() {
        Api.profileStatFetch(this.user.userData.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(PROFILE.RENDER_STAT, data);
                        });
                    break;
                case RESPONSE.UNAUTH:
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
