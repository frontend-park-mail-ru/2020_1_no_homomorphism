import * as C from '../../libs/constans.js';

/**
 * вью для альбомов профиля
 */
export class ProfileArtistsView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(C.RENDER_PROFILE_ARTISTS, this.drawArtists.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Нажатие
     ** @param {Object} artists
     */
    drawArtists(artists) {
        const elem = document.getElementById('profile-album-playlist-list');
        console.log(elem);
        console.log(artists.length);
        elem.className += ' l-profile-base';
        for (let i = 0; i < artists.length; i++) {
            const temp = artists[i].image;
            if (temp.split('/')[0] === 'static') {
                artists[i].image = '/' + temp;
            }
            // eslint-disable-next-line no-undef,max-len
            elem.innerHTML += nunjucks.render('../../../views/profile/profile_artists.njk', artists[i]);
        }
        console.log(elem);
    }
}
