import {Api} from '../../libs/api.js';
import {PROFILE} from '../../libs/constans.js';
/**
 * Модель Профиля
 */
export class ProfilePlaylistsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.ID_PLAYLISTS_SECTION, this.getTracks.bind(this));
        this.eventBus = eventBus;
        this.data = {
            queue: [],
            playlist: [],
            current: 0,
            playing: false,
            shuffle: false,
            repeat: false,
        };
    }

    /**
     * Получение списка треков
     */
    getTracks() {
        if (this.data.playlist.length === 6) {
            this.eventBus.emit(PROFILE.RENDER_PLAYLISTS, this.data.playlist);
        } else {
            for (let i = 12344; i < 12350; i++) {
                Api.trackFetch(i.toString())
                    .then((response) => response.json())
                    .then((track) => {
                        this.data.playlist.push(track);
                        this.data.queue.push(this.data.playlist.length - 1);
                    })
                    .then(() => {
                        if (this.data.playlist.length === 6) {
                            this.eventBus.emit(PROFILE.RENDER_PLAYLISTS, this.data.playlist);
                        }
                    });
            }
        }
    }
}
