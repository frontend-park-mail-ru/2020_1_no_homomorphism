import ProfileArtistsModel from '@models/profile/profile_artists.js';
import ProfileArtistsView from '@views/profile/profile_artists.js';

/**
 * Контроллер для треков профиля
 */
export class ProfileArtistsController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} eventBus
     */
    constructor(router, eventBus) {
        this.eventBus = eventBus;
        this.model = new ProfileArtistsModel(this.eventBus);
        this.view = new ProfileArtistsView(this.eventBus);
    }
}
