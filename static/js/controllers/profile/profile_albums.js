import ProfileAlbumsModel from '@models/profile/profile_albums';
import ProfileAlbumsView from '@views/profile/profile_albums';

/**
 * Контроллер для альбомов профиля
 */
export class ProfileAlbumsController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(router, eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.model = new ProfileAlbumsModel(this.eventBus);
        this.view = new ProfileAlbumsView(this.eventBus, this.globalEventBus);
    }
}
