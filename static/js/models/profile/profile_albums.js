import Api from '../../libs/api.js';
import {PROFILE} from '../../libs/constans.js';

/**
 * Модель альбомов профиля
 */
export default class ProfileAlbumsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.ID_ALBUMS_SECTION, this.getAlbums.bind(this));
        this.eventBus = eventBus;
        this.playlist = [];
    }

    /**
     * Получение списка альбомов
     */
    getAlbums() {
        if (this.playlist.length === 6) {
            this.eventBus.emit(PROFILE.RENDER_ALBUMS, this.playlist);
        } else {
            for (let i = 12344; i < 12350; i++) {
                Api.trackFetch(i.toString())
                    .then((response) => response.json())
                    .then((track) => {
                        this.playlist.push(track);
                    })
                    .then(() => {
                        if (this.playlist.length === 6) {
                            this.eventBus.emit(PROFILE.RENDER_ALBUMS, this.playlist);
                        }
                    });
            }
        }
    }
}
