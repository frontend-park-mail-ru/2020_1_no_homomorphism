import ProfilePlaylistsModel from '@models/profile/profile_playlists.js';
import ProfilePlaylistsView from '@views/profile/profile_playlists.js';

/**
 * Контроллер для треков профиля
 */
export class ProfilePlaylistsController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(router, eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.model = new ProfilePlaylistsModel(this.eventBus);
        this.view = new ProfilePlaylistsView(this.eventBus, globalEventBus);
    }
}
