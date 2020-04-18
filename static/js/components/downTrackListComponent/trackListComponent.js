import template from '@components/downTrackListComponent/tracks.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choosePlaylistComponent/choosePlaylistComponent';

/**
 * Компонент - список треков
 */
export default class TrackListComponent {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {object} constType
     */
    constructor(eventBus, constType) {
        eventBus.on(constType.RENDER_TRACKS, this.renderTracks.bind(this));
        eventBus.on(constType.SET_PLAYLIST_ID, this.setId.bind(this));
        eventBus.on(constType.SET_ALBUM_ID, this.setId.bind(this));
        eventBus.on(constType.SET_ARTIST_ID, this.setId.bind(this));
        this.choosePlaylist = new ChoosePlaylist(eventBus, constType);
        this.constType = constType;
        this.eventBus = eventBus;
        this.tracklist = [];
        this.id = 0;
        this.type = '';
    }

    /**
     * Отрисовка списка треков
     * @param {Object} data
     */
    renderTracks(data) {
        this.tracklist = data.tracks;
        this.type = data.type;
        const elem = document.getElementsByClassName(data.domItem)[0];
        elem.innerHTML = template(data.tracks);
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
        document.querySelectorAll('img.m-big-more-button').forEach((button) => { // TODO Обработать
        });
        document.querySelectorAll('img.m-big-like-button').forEach((button) => {
            button.onclick = (event) => this.likeClicked(event);
        });
        // document.querySelectorAll('img.m-big-add-button').forEach((button) => {
        // });
    }

    /**
     * Слушает нажатие на play
     * @param {Object} event
     */
    trackClick(event) {
        const trackID = this.getIdByClick(event);
        globalEventBus.emit(`global-play-${this.type}-tracks`,
            this.id,
            trackID,
            this.tracklist.length);
    }

    /**
     * Слушает добавление в плейлист
     * @param {Object} event
     */
    addToPlaylist(event) {
        this.choosePlaylist.trackID = this.getIdByClick(event);
        this.choosePlaylist.render(this.setTracksEventListeners.bind(this));
    }

    /**
     * Получение id из dom-елемента по нажатию
     * @param {Object} event
     * @return {string}
     */
    getIdByClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-track-big' &&
                current.getAttribute('a-id') !== null) {
                return current.getAttribute('a-id');
            } else {
                current = current.parentNode;
            }
        }
    }

    /**
     * Слушает клик мыши по кнопке лайка на треке в плейлисте
     * @param {Object} event
     */
    likeClicked(event) { // TODO отправить наверх
        if (event.target.src.indexOf('/static/img/favorite_border.svg') !== -1) {
            event.target.src = '/static/img/favorite.svg';
        } else {
            event.target.src = '/static/img/favorite_border.svg';
        }
    }
}
