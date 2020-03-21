import {Api} from '../../libs/api.js';
import {PROFILE} from '../../libs/constans.js';
// import {Router} from '../libs/router.js';

/**
 * Модель альбомов профиля
 */
export class ProfileArtistsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.ID_ARTISTS_SECTION, this.getArtists.bind(this));
        this.eventBus = eventBus;
        this.artists = [];
    }
    /**
     * Получение списка альбомов
     */
    getArtists() {
        if (this.artists.length === 6) {
            this.eventBus.emit(PROFILE.RENDER_ARTISTS, this.artists);
        } else {
            for (let i = 12344; i < 12350; i++) {
                Api.trackFetch(i.toString())
                    .then((response) => response.json())
                    .then((track) => {
                        this.artists.push(track);
                    })
                    .then(() => {
                        if (this.artists.length === 6) {
                            this.eventBus.emit(PROFILE.RENDER_ARTISTS, this.artists);
                        }
                    });
            }
        }
    }
}
