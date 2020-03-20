import {Api} from '../../libs/api.js';
import * as C from '../../libs/constans.js';
// import {Router} from '../libs/router.js';

/**
 * Модель альбомов профиля
 */
export class ProfileAlbumsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(C.ID_ALBUMS_SECTION, this.getAlbums.bind(this));
        this.eventBus = eventBus;
        this.playlist = [];
    }

    /**
     * Получение списка альбомов
     */
    getAlbums() {
        if (this.playlist.length === 6) {
            this.eventBus.emit(C.RENDER_PROFILE_ALBUMS, this.playlist);
        } else {
            for (let i = 12344; i < 12350; i++) {
                Api.trackFetch(i.toString())
                    .then((response) => response.json())
                    .then((track) => {
                        this.playlist.push(track);
                    })
                    .then(() => {
                        if (this.playlist.length === 6) {
                            this.eventBus.emit(C.RENDER_PROFILE_ALBUMS, this.playlist);
                        }
                    });
            }
        }
    }
}
