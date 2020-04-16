import template from '@components/downTrackListComponent/tracks.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';

/**
 * Компонент - список треков
 */
export default class TrackListComponent {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {object} command
     */
    constructor(eventBus, command) {
        eventBus.on(command.RENDER_TRACKS, this.renderTracks.bind(this));
        eventBus.on(command.SET_PLAYLIST_ID, this.setId.bind(this));
        eventBus.on(command.SET_ALBUM_ID, this.setId.bind(this));
        eventBus.on(command.SET_ARTIST_ID, this.setId.bind(this));
        this.command = command;
        this.eventBus = eventBus;
        this.tracklist = [];
        this.id = 0;
        this.type = '';
    }

    /**
     * Отрисовка списка треков
     * @param {Object} tracks
     * @param {string} domItem
     * @param {string} type
     */
    renderTracks(tracks, domItem, type) {
        this.tracklist = tracks;
        this.type = type;
        const elem = document.getElementsByClassName(domItem)[0];
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
        // document.querySelectorAll('.m-button-track-play').forEach((track) => {
        //     track.onclick = (event) => this.trackClick.bind(this)(event);
        // });
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
                globalEventBus.emit(`global-play-${this.type}-tracks`,
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
