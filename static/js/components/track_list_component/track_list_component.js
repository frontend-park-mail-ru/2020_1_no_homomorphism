import template from '@components/track_list_component/tracks.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choose_playlist_component/choose_playlist_component';
import TrackComponent from '@components/track_component/track_component';
import PlaylistComponent from '@components/playlist_component/playlist_component';
import {PLAYLIST} from '@libs/constans';

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
        eventBus.on(constType.RENDER_TRACKS, this.render.bind(this));
        eventBus.on(constType.SET_PLAYLIST_ID, this.setId.bind(this));
        eventBus.on(constType.SET_ALBUM_ID, this.setId.bind(this));
        eventBus.on(constType.SET_ARTIST_ID, this.setId.bind(this));
        this._choosePlaylist = new ChoosePlaylist(eventBus, constType);
        this._trackComponent = new TrackComponent();
        this._playlistComponent = new PlaylistComponent(this.setTracksEventListeners.bind(this));
        this.eventBus = eventBus;
        this._tracklist = [];
        this._id = 0;
        this._type = '';
    }

    /**
     * Установка айди (альбома или плейлиста)
     * @param {number} id
     */
    setId(id) {
        this._id = id;
    }

    /**
     * Отрисовка списка треков
     * @param {Object} data
     */
    render(data) {
        this._tracklist = data.tracks;
        this._type = data.type;
        this._tracklist.type = this._type === 'playlist';
        const elem = document.getElementsByClassName(data.domItem)[0];
        elem.innerHTML = template(this._tracklist);
        this.setTracksEventListeners();
    }

    /**
     * Set EventListeners
     */
    setTracksEventListeners() {
        document.querySelectorAll('.m-track-image').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
        document.querySelectorAll('.m-button-track-play').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
        document.querySelectorAll('.m-big-add-button').forEach((track) => {
            track.onclick = (event) => this.addToPlaylist.bind(this)(event);
        });
        document.querySelectorAll('img.m-big-like-button').forEach((button) => {
            button.onclick = (event) => this.likeClicked(event);
        });
        if (this._tracklist.type) {
            document.querySelectorAll('img.m-big-delete-button').forEach((button) => {
                button.onclick = (event) => this.deleteClicked(event);
            });
        }
    }

    /**
     * Слушает нажатие на play
     * @param {Object} event
     */
    playTrack(event) {
        const trackData = this.getIdByClick(event);
        globalEventBus.emit(`global-play-${this._type}-tracks`,
            this._id,
            trackData.id,
            this._tracklist.length);
    }

    /**
     * Слушает добавление в плейлист
     * @param {Object} event
     */
    addToPlaylist(event) {
        this._choosePlaylist.trackData = this.getIdByClick(event);
        this.getProfilePlaylists();
    }

    /**
     * Получение плейлистов пользователя
     */
    getProfilePlaylists() {
        this._playlistComponent.getProfilePlaylistsApi(this.callChoosePlaylist.bind(this));
    }

    /**
     * Вызов компоненты choosePlaylist
     * @param {Array} playlistList
     */
    callChoosePlaylist(playlistList) {
        this._choosePlaylist
            .render(this.setTracksEventListeners.bind(this), playlistList);
    }

    /**
     * Получение id из dom-елемента по нажатию
     * @param {Object} event
     * @return {Object}
     */
    getIdByClick(event) {
        let current = event.target;
        while (!current.classList.contains('l-down-card')) {
            if (current.classList.contains('l-track-big') &&
                current.getAttribute('t-id') !== null) {
                this.trackToDelete = current;
                return {
                    'id': current.getAttribute('t-id'),
                    'image': current.getAttribute('t-image'),
                };
            }
            current = current.parentNode;
        }
    }

    /**
     * Удаление трека из плейлиста
     * @param {Object} event
     */
    deleteClicked(event) {
        const trackData = this.getIdByClick(event);
        this._trackComponent.trackData = trackData;
        this._trackComponent.delFromPlaylist(this._id);
        this.deleteFromDOM(trackData.id);
    }

    /**
     * Удаление элемента из DOM
     * @param {string} trackID
     */
    deleteFromDOM(trackID) {
        this.eventBus.emit(PLAYLIST.CHANGE_TRACK_AMOUNT, -1);
        for (let i = this._tracklist.length - 1; i >= 0; i--) {
            if (this._tracklist[i].id === trackID) {
                this.trackToDelete.remove();
                this._tracklist.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Слушает клик мыши по кнопке лайка на треке в плейлисте
     * @param {Object} event
     */
    likeClicked(event) {
        alert('This functionality is not accessible by now');
        // if (event.target.src.indexOf('/static/img/favorite_border.svg') !== -1) {
        //     event.target.src = '/static/img/favorite.svg';
        // } else {
        //     event.target.src = '/static/img/favorite_border.svg';
        // }
    }
}
