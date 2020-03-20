import {Api} from '../../libs/api.js';
import * as C from '../../libs/constans.js';

// import {Router} from '../libs/router.js';

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
        this.eventBus.on(C.GET_PROFILE_DATA, this.getUserData.bind(this));
        // this.eventBus.on('get user tracks', this.getTracks.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() { // TODO обработать некорректные события
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(C.REDIRECT, C.URL_MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(C.RENDER_PROFILE_DATA, data);
                        });
                } else {
                    this.eventBus.emit(C.NO_ANSWER, C.URL_MAIN);
                }
            });
    }
}
