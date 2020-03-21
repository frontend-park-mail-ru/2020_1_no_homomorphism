import {PROFILE, TEMPLATES} from '../../libs/constans.js';

/**
 * вью для профиля
 */
export class ProfilePlaylistsView {
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
        for (let i = 0; i < playlists.length; i++) {
            const temp = playlists[i].image;
            if (temp.split('/')[0] === 'static') {
                playlists[i].image = '/' + temp;
            }
            // eslint-disable-next-line no-undef,max-len
            elem.innerHTML += nunjucks.render(TEMPLATES.PROFILE_PLAYLISTS, playlists[i]);
        }
    }
}
