import {Api} from '../../libs/api.js';
import * as C from '../../libs/constans.js';

// import {Router} from '../libs/router.js';

/**
 * Модель Профиля
 */
export class ProfileTracksModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(C.ID_TRACKS_SECTION, this.getTracks.bind(this));
        this.eventBus = eventBus;
        this.playlist = [];
    }

    /**
     * Получение списка треков
     */
    getTracks() {
        if (this.playlist.length === 6) {
            this.eventBus.emit(C.RENDER_PROFILE_TRACKS, this.playlist);
        } else {
            for (let i = 12344; i < 12350; i++) {
                Api.trackFetch(i.toString())
                    .then((response) => response.json())
                    .then((track) => {
                        this.playlist.push(track);
                    })
                    .then(() => {
                        if (this.playlist.length === 6) {
                            this.eventBus.emit(C.RENDER_PROFILE_TRACKS, this.playlist);
                        }
                    });
            }
        }
    }
}
