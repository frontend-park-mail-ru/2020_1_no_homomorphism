import template from '@components/downTrackListComponent/tracks.tmpl.xml';
import {GLOBAL} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

/**
 * Компонент - список треков
 */
export default class TrackListComponent {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {string} command
     */
    constructor(eventBus, command) {
        eventBus.on(command, this.renderTracks.bind(this));
        this.eventBus = eventBus;
        this.tracklist = [];
        this.id = 0;
    }

    /**
     * Отрисовка списка треков
     * @param {Object} tracks
     * @param {string} domItem
     */
    renderTracks(tracks, domItem) {
        const elem = document.getElementsByClassName(domItem)[0];
        this.tracklist = tracks;
        elem.className += ' l-profile-base';
        elem.innerHTML += template(tracks);
        this.setTracksEventListeners();
    }

    /**
     * Set EventListeners
     * @param {number} id
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Set EventListeners
     */
    setTracksEventListeners() {
        document.querySelectorAll('.l-track-big').forEach((track) => {
            track.onclick = (event) => this.trackClick.bind(this)(event);
        });
    }

    /**
     * Слушает клик по треку
     * @param {Object} event
     */
    trackClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-track-big' &&
                current.getAttribute('a-id') !== null) {
                globalEventBus.emit(GLOBAL.PLAY_ARTIST_TRACKS,
                    this.id,
                    current.getAttribute('a-id'),
                    this.tracklist.length);
                break;
            } else {
                current = current.parentNode;
            }
        }
    }
}
