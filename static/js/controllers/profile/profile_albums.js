import ProfileAlbumsModel from '@models/profile/profile_albums.js';
import ProfileAlbumsView from '@views/profile/profile_albums.js';

/**
 * Контроллер для альбомов профиля
 */
export class ProfileAlbumsController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} eventBus
     */
    constructor(router, eventBus) {
        this.eventBus = eventBus;
        this.model = new ProfileAlbumsModel(this.eventBus);
        this.view = new ProfileAlbumsView(this.eventBus);
    }
}
