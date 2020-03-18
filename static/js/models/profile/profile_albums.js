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
     * Получение списка альбомов
     */
    getAlbums() {
        if (this.data.playlist.length === 6) {
            this.eventBus.emit('render profile albums', {});
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
                            this.eventBus.emit('render profile albums', {});
                        }
                    });
            }
        }
    }
}
