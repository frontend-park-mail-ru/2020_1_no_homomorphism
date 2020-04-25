import EventBus from '@libs/eventBus';
import ProfileModel from '@models/profile/profile';
import ProfileView from '@views/profile/profile';
import {ProfileArtistsController} from '@controllers/profile/profile_artists';

/**
 * Контроллер для профиля
 */
export class ProfileController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new ProfileModel(this.eventBus);
        this.view = new ProfileView(this.eventBus);
        // --------- Albums
        this.artistsController = new ProfileArtistsController(router, this.eventBus);
    }
}
