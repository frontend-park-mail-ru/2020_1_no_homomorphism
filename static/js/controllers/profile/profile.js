import {EventBus} from '../../libs/eventBus.js';
import {ProfileModel} from '../../models/profile/profile.js';
import {ProfileView} from '../../views/profile/profile.js';
import {ProfileTracksController} from '../../controllers/profile/profile_tracks.js';
import {ProfileAlbumsController} from '../../controllers/profile/profile_albums.js';

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
        this.eventBus.on('redirect', router.redirect.bind(router));
        this.eventBus.on('no answer', router.redirect.bind(router));
        // --------- Albums
        this.albumsController = new ProfileAlbumsController(router, this.eventBus);
        this.tracksController = new ProfileTracksController(router, this.eventBus);
    }
}
