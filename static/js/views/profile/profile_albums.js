import * as C from '../../libs/constans.js';

/**
 * вью для альбомов профиля
 */
export class ProfileAlbumsView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(C.RENDER_PROFILE_ALBUMS, this.drawAlbums.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Нажатие
     ** @param {Object} albums
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
            elem.innerHTML += nunjucks.render('../../../views/profile/profile_albums.njk', albums[i]);
        }
        console.log(elem);
    }
}
