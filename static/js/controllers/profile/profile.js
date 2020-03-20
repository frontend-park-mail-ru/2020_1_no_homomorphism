import {EventBus} from '../../libs/eventBus.js';
import {ProfileModel} from '../../models/profile/profile.js';
import {ProfileView} from '../../views/profile/profile.js';
import {ProfileTracksController} from '../../controllers/profile/profile_tracks.js';
import {ProfileAlbumsController} from '../../controllers/profile/profile_albums.js';
import {ProfilePlaylistsController} from '../../controllers/profile/profile_playlists.js';
import {ProfileArtistsController} from '../../controllers/profile/profile_artists.js';
import * as C from '../../libs/constans.js';

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
        this.eventBus.on(C.REDIRECT, router.redirect.bind(router));
        this.eventBus.on(C.NO_ANSWER, router.redirect.bind(router));
        // --------- Albums
        this.albumsController = new ProfileAlbumsController(router, this.eventBus);
        this.tracksController = new ProfileTracksController(router, this.eventBus);
        this.playlistsController = new ProfilePlaylistsController(router, this.eventBus);
        this.artistsController = new ProfileArtistsController(router, this.eventBus);
    }
}
