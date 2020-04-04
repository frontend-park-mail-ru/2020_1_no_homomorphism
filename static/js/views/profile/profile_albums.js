import {PROFILE } from '@libs/constans.js';
import template from '@views/profile/profile_album.tmpl.xml';


/**
 * вью для альбомов профиля
 */
export default class ProfileAlbumsView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.RENDER_ALBUMS, this.drawAlbums.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Нажатие
     * @param {Object} albums
     */
    drawAlbums(albums) {
        const elem = document.getElementById('profile-album-playlist-list');
        elem.className += ' l-profile-base';
        elem.innerHTML += template(albums);
    }
}
