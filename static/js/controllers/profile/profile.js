import EventBus from '@libs/eventBus';
import ProfileModel from '@models/profile/profile';
import ProfileView from '@views/profile/profile';
import {ProfileArtistsController} from '@controllers/profile/profile_artists';
import {PROFILE} from '@libs/constans';

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
        this.eventBus.on(PROFILE.REDIRECT, router.redirect.bind(router));
        this.eventBus.on(PROFILE.NO_ANSWER, router.redirect.bind(router));
        // --------- Albums
        this.artistsController = new ProfileArtistsController(router, this.eventBus);
    }
}
