import {PROFILE, TEMPLATES} from '../../libs/constans.js';

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
        // const elem = document.getElementById('profile-album-playlist-list');
        // elem.className += ' l-profile-base';
        // for (let i = 0; i < artists.length; i++) {
        //     const temp = artists[i].image;
        //     if (temp.split('/')[0] === 'static') {
        //         artists[i].image = '/' + temp;
        //     }
        //     // eslint-disable-next-line no-undef,max-len
        //     elem.innerHTML += nunjucks.render(TEMPLATES.PROFILE_ARTISTS, artists[i]);
        // }
    }
}
