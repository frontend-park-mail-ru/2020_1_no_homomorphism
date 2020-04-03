import {PROFILE} from '@libs/constans.js';
import template from '@views/profile/profile_playlist.tmpl.xml';


/**
 * вью для профиля
 */
export default class ProfilePlaylistsView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.RENDER_PLAYLISTS, this.drawPlaylists.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Отрисовка списка треков
     * @param {Object} playlists
     */
    drawPlaylists(playlists) {
        const elem = document.getElementById('profile-album-playlist-list');
        elem.className += ' l-profile-base';
        elem.innerHTML += template(playlists);
    }
}
