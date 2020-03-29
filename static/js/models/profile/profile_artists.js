import Api from '../../libs/api.js';
import {PROFILE} from '../../libs/constans.js';

/**
 * Модель альбомов профиля
 */
export default class ProfileArtistsModel {
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
        Api.profilePlaylistsFetch().then((response) => response.json())
            .then((list) => {
                this.playlists = list.playlists;
            })
            .then(() => {
                this.eventBus.emit(PROFILE.RENDER_PLAYLISTS, this.playlists);
            });
    }
}
