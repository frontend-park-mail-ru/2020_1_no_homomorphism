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
        this.data = {
            queue: [],
            playlist: [],
            current: 0,
            playing: false,
            shuffle: false,
            repeat: false,
        };
        this.eventBus.on(C.GET_PROFILE_DATA, this.getUserData.bind(this));
        // this.eventBus.on('get user tracks', this.getTracks.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit('redirect', '/');
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(C.RENDER_PROFILE_DATA, data);
                        });
                } else {
                    this.eventBus.emit('no answer', '/');
                }
            });
    }
}
