import * as C from '../../libs/constans.js';
/**
 * вью для профиля
 */
export class ProfileTracksView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(C.RENDER_PROFILE_TRACKS, this.drawTracks.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Отрисовка списка треков
     * @param {Object} tracks
     */
    drawTracks(tracks) {
        const elem = document.getElementById('profile-track-list');
        elem.className += ' l-profile-base';
        for (let i = 0; i < tracks.length; i++) {
            const temp = tracks[i].image;
            if (temp.split('/')[0] === 'static') {
                tracks[i].image = '/' + temp;
            }
            // eslint-disable-next-line no-undef,max-len
            elem.innerHTML += nunjucks.render('../../../views/profile/profile_track.njk', tracks[i]);
        }
    }
}
