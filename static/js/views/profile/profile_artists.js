import {PROFILE} from '@libs/constans.js';
import template from '@views/profile/profile_artist.tmpl.xml';


/**
 * вью для альбомов профиля
 */
export default class ProfileArtistsView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.RENDER_ARTISTS, this.drawArtists.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Нажатие
     * @param {Object} artists
     */
    drawArtists(artists) {
        const elem = document.getElementById('profile-album-playlist-list');
        elem.className += ' l-profile-base';
        elem.innerHTML +=template(artists);
    }
}
