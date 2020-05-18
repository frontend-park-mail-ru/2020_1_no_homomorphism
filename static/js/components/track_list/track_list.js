import template from '@components/track_list/tracks.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choose_playlist/choose_playlist';
import TrackComponent from '@components/track/track';
import PlaylistComponent from '@components/playlist/playlist';
// import PopUp from '@components/pop-up/pop-up';
import {PLAYLIST, GLOBAL, URL, RESPONSE} from '@libs/constants';
import User from '@libs/user';
import Api from '@libs/api';

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
        if (this._tracklist.length !== 0) {
            this.setTracksEventListeners();
        }
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
        if (this._type === 'search') {
            this.getTrackInfo(trackData.id);
            return;
        }
        if (this._type === 'track') {
            const temp = this._tracklist;
            delete temp.type;
            globalEventBus.emit(`global-play-${this._type}-tracks`,
                {'tracks': this._tracklist}, trackData.id);
            return;
        }
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
        if (!User.exists()) {
            return;
        }
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
        this._choosePlaylist.render(this.setTracksEventListeners.bind(this), playlistList);
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
     * Get track from db
     * @param {String} id
     */
    getTrackInfo(id) {
        Api.trackGet(id).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                res.json().then((elem) => {
                    globalEventBus.emit(GLOBAL.PLAY_TRACKS, {
                        tracks: [elem],
                    }, elem.id);
                });
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
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
                this._changeNumbers(i);
                break;
            }
        }
    }

    /**
     * Change track number after deleting
     * @param {number} index
     */
    _changeNumbers(index) {
        document.querySelectorAll('.m-index').forEach((elem) => {
            if (elem.innerHTML > index) {
                elem.innerHTML--;
            }
        });
    }

    /**
     * Слушает клик мыши по кнопке лайка на треке в плейлисте
     * @param {Object} event
     */
    likeClicked(event) {
        // Поп-апы
        if (!User.exists()) {
            globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
        }
        alert('This functionality is not accessible by now');
    }
}
