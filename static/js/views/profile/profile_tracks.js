import {PROFILE, TEMPLATES} from '../../libs/constans.js';

/**
 * вью для профиля
 */
export default class ProfileTracksView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.RENDER_TRACKS, this.renderTracks.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Отрисовка списка треков
     * @param {Object} tracks
     */
    renderTracks(tracks) {
        const elem = document.getElementById('profile-track-list');
        elem.className += ' l-profile-base';
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].image = tracks[i].link; // TODO временное решение
            // eslint-disable-next-line no-undef,max-len
            elem.innerHTML += nunjucks.render(TEMPLATES.PROFILE_TRACKS, tracks[i]);
        }
    }
}