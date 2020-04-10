import {PROFILE} from '@libs/constans';
import template from '@views/template/tracks.tmpl.xml';

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
        elem.innerHTML += template(tracks);
    }
}
