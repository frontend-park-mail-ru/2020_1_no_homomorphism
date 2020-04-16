import template from '@components/downTrackListComponent/tracks.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import DropdownPlaylist from '@components/dropdownPlaylistComponent/dropdownPlaylistComponent';

/**
 * Компонент - список треков
 */
export default class TrackListComponent {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {object} modelType
     */
    constructor(eventBus, modelType) {
        eventBus.on(modelType.RENDER_TRACKS, this.renderTracks.bind(this));
        eventBus.on(modelType.SET_PLAYLIST_ID, this.setId.bind(this));
        eventBus.on(modelType.SET_ALBUM_ID, this.setId.bind(this));
        eventBus.on(modelType.SET_ARTIST_ID, this.setId.bind(this));
        this.dropdownPlaylist = new DropdownPlaylist(eventBus, modelType);
        this.modelType = modelType;
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
        document.querySelectorAll('.m-track-image').forEach((track) => {
            track.onclick = (event) => this.trackClick.bind(this)(event);
        });
        document.querySelectorAll('.m-big-add-button').forEach((track) => {
            track.onclick = (event) => this.addToPlaylist.bind(this)(event);
        });
        document.querySelectorAll('.m-button-track-play').forEach((track) => {
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

    /**
     * Слушает добавление в плейлист
     * @param {Object} event
     */
    addToPlaylist(event) {
        this.eventBus.emit(this.modelType.DROPDOWN, event);
        // console.log('lol');
    }
}
