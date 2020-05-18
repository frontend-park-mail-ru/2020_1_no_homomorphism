import template from '@components/track_list/tracks.tmpl.xml';
import emptyTemplate from '@components/empty_block/empty.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choose_playlist/choose_playlist';
import TrackComponent from '@components/track/track';
import PlaylistComponent from '@components/playlist/playlist';
import {PLAYLIST, GLOBAL, RESPONSE, PROFILE, POPUP} from '@libs/constants';
import User from '@libs/user';
import Api from '@libs/api';
import PopUp from '@components/pop-up/pop-up';

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
        this._choosePlaylist = new ChoosePlaylist(eventBus, constType);
        this._trackComponent = new TrackComponent();
        this._playlistComponent = new PlaylistComponent(this.setTracksEventListeners.bind(this));
        this.eventBus = eventBus;
        this._tracklist = [];
        this._id = 0;
        this._type = '';
        this._baseDom = '';
        this._subscribe.bind(this)(constType);
    }

    /**
     * Конструткор
     * @param {object} constType
     */
    _subscribe(constType) {
        this.eventBus.on(constType.RENDER_TRACKS, this.render.bind(this));
        if (constType.SET_PLAYLIST_ID !== undefined) {
            this.eventBus.on(constType.SET_PLAYLIST_ID, this.setId.bind(this));
        }
        if (constType.SET_ALBUM_ID !== undefined) {
            this.eventBus.on(constType.SET_ALBUM_ID, this.setId.bind(this));
        }
        if (constType.SET_ARTIST_ID !== undefined) {
            this.eventBus.on(constType.SET_ARTIST_ID, this.setId.bind(this));
        }
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
        this._baseDom = data.domItem;
        if (this._type === 'search' && this._tracklist.length === 0) {
            return;
        }
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
        switch (this._type) {
        case 'search':
            this.getTrackInfo(trackData.id);
            break;
        case 'track':
            delete this._tracklist.type;
            globalEventBus.emit(`global-play-${this._type}-tracks`,
                {'tracks': this._tracklist}, trackData.id);
            break;
        case 'liked':
            delete this._tracklist.type;
            globalEventBus.emit(GLOBAL.PLAY_TRACKS,
                {'tracks': this._tracklist}, trackData.id);
            break;
        default:
            globalEventBus.emit(`global-play-${this._type}-tracks`,
                this._id,
                trackData.id,
                this._tracklist.length);
            return;
        }
    }

    /**
     * Слушает добавление в плейлист
     * @param {Object} event
     */
    addToPlaylist(event) {
        if (!User.exists()) {
            new PopUp(POPUP.LOGIN_ERROR, true);
            // globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
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
     * Get track from db
     * @param {String} id
     */
    getTrackInfo(id) {
        Api.trackGet(id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((elem) => {
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
        for (let i = this._tracklist.length - 1; i >= 0; i--) {
            if (this._tracklist[i].id === trackID) {
                this.trackToDelete.remove();
                this._tracklist.splice(i, 1);
                this._changeNumbers(i);
                break;
            }
        }
        if (this._tracklist.length < 1) {
            this._setEmpty();
        }
        if (this._type === 'playlist') {
            this.eventBus.emit(PLAYLIST.CHANGE_TRACK_AMOUNT, -1);
        }
        if (this._type === 'liked') {
            this.eventBus.emit(PROFILE.CHANGE_TRACK_AMOUNT, this._tracklist.length);
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
        if (!User.exists()) {
            new PopUp(POPUP.LOGIN_ERROR, true);
            // globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
        }
        const likedTrack = this.getIdByClick(event);
        this._tracklist.forEach((elem) => {
            if (elem.id === likedTrack.id) {
                elem.is_liked = !elem.is_liked;
            }
        });
        this._doLike(likedTrack.id, event.target);
    }

    /**
     * Change liked\dislike image in track or delete
     * @param {number} id
     * @param {Object} domItem
     */
    _changeImage(id, domItem) {
        if (this._type === 'liked') {
            this.deleteFromDOM(id.toString());
            return;
        }
        domItem.classList.toggle('is-liked');
        domItem.classList.toggle('is-not-liked');
    }

    /**
     * Установка заглушки после удаление всего
     */
    _setEmpty() {
        document.getElementsByClassName(this._baseDom)[0]
            .innerHTML = emptyTemplate('You dont have any liked tracks');
    }

    /**
     * Отправка лайка
     * @param {number} id
     * @param {Object} domItem
     */
    _doLike(id, domItem) {
        Api.trackLike(id.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this._changeImage.bind(this)(id, domItem);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
