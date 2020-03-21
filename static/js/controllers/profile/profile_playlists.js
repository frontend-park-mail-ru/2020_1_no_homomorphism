import ProfilePlaylistsModel from '../../models/profile/profile_playlists.js';
import ProfilePlaylistsView from '../../views/profile/profile_playlists.js';

/**
 * Контроллер для треков профиля
 */
export class ProfilePlaylistsController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} eventBus
     */
    constructor(router, eventBus) {
        this.eventBus = eventBus;
        this.model = new ProfilePlaylistsModel(this.eventBus);
        this.view = new ProfilePlaylistsView(this.eventBus);
    }
}
