import Api from '@libs/api.js';
import {PROFILE} from '@libs/constans.js';

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
        Api.profilePlaylistsFetch().then((response) => response.json())
            .then((list) => {
                this.playlists = list.playlists;
            })
            .then(() => {
                this.eventBus.emit(PROFILE.RENDER_PLAYLISTS, this.playlists);
            });
    }
}
