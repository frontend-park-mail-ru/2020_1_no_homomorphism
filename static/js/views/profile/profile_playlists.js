import {PROFILE, GLOBAL} from '@libs/constans.js';
import template from '@views/profile/profile_playlist.tmpl.xml';

/**
 * вью для профиля
 */
export default class ProfilePlaylistsView {
    /**
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.globalEventBus = globalEventBus;
        this.eventBus = eventBus;
        this.eventBus.on(PROFILE.RENDER_PLAYLISTS, this.drawPlaylists.bind(this));
    }

    /**
     * Отрисовка списка треков
     * @param {Object} playlists
     */
    drawPlaylists(playlists) {
        const elem = document.getElementById('profile-album-playlist-list');
        elem.className += ' l-profile-base';
        elem.innerHTML += template(playlists);
        this.setEventListeners();
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.querySelectorAll('.m-button-track-play-playlist').forEach((playlist) => {
            playlist.onclick = (event) => this.playlistClick.bind(this)(event);
        });
    }

    /**
     * Слушает клик по плейлисту в профиле
     * @param {Object} event
     */
    playlistClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-list-card' &&
                current.getAttribute('id') !== null) {
                this.globalEventBus.emit(GLOBAL.PLAY_PLAYLIST, {index: current.getAttribute('id')});
                break;
            } else {
                current = current.parentNode;
            }
        }
    }
}
