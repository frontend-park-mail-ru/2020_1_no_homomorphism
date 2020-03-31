import {PROFILE, TEMPLATES} from '@libs/constans.js';
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
        console.log(albums);
        const elem = document.getElementById('profile-album-playlist-list');
        elem.className += ' l-profile-base';
        for (let i = 0; i < albums.length; i++) {
            const temp = albums[i].image;
            // if (temp.split('/')[0] === 'static') {
            //     albums[i].image = '/' + temp;

            // }
            elem.innerHTML += template(albums[i]);
        }
    }
}
