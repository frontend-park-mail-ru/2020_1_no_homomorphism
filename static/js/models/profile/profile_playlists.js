import Api from '@libs/api.js';
import {PROFILE} from '@libs/constans.js';

/**
 * Модель Профиля
 */
export default class ProfilePlaylistsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.playlists = [];
        this.eventBus.on(PROFILE.ID_PLAYLISTS_SECTION, this.getPlaylists.bind(this));
    }

    /**
     * Получение списка плейлистов
     */
    getPlaylists() {
        Api.profilePlaylistsFetch().then((response) => response.json())
            .then((list) => {
                this.playlists = list.playlists;
            })
            .then(() => {
                this.eventBus.emit(PROFILE.RENDER_PLAYLISTS, this.playlists);
            });
    }
}
