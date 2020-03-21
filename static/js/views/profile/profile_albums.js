import {PROFILE, TEMPLATES} from '../../libs/constans.js';

/**
 * вью для альбомов профиля
 */
export class ProfileAlbumsView {
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
        console.log('drawAlbums');
        const elem = document.getElementById('profile-album-playlist-list');
        console.log(elem);
        console.log(albums.length);
        elem.className += ' l-profile-base';
        for (let i = 0; i < albums.length; i++) {
            const temp = albums[i].image;
            if (temp.split('/')[0] === 'static') {
                albums[i].image = '/' + temp;
            }
            // eslint-disable-next-line no-undef,max-len
            elem.innerHTML += nunjucks.render(TEMPLATES.PROFILE_ALBUMS, albums[i]);
        }
        console.log(elem);
    }
}
