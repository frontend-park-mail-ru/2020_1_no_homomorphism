import {Api} from '../../libs/api.js';
import {PROFILE} from '../../libs/constans.js';

// import {Router} from '../libs/PROFILE.js';

/**
 * Модель Профиля
 */
export class ProfileModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(PROFILE.GET_DATA, this.getUserData.bind(this));
        // this.eventBus.on('get user tracks', this.getTracks.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() { // TODO обработать некорректные события
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(PROFILE.REDIRECT, PROFILE.URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(PROFILE.RENDER_DATA, data);
                        });
                } else {
                    this.eventBus.emit(PROFILE.NO_ANSWER, PROFILE.URL.MAIN);
                }
            });
    }
}
