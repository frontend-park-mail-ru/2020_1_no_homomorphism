import Api from '../../libs/api.js';
import {PROFILE, URL} from '../../libs/constans.js';

/**
 * Модель Профиля
 */
export default class ProfileModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(PROFILE.GET_DATA, this.getUserData.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() { // TODO обработать некорректные события
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(PROFILE.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(PROFILE.RENDER_DATA, data);
                        });
                } else {
                    this.eventBus.emit(PROFILE.NO_ANSWER, URL.MAIN);
                }
            });
    }
}
