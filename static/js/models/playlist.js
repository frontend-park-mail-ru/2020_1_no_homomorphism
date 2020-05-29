import {PLAYLIST, RESPONSE, URL, GLOBAL, POPUP} from '@libs/constants';
import Api from '@libs/api';
import User from '@libs/user';
import Validation from '@libs/validation';
import {globalEventBus} from '@libs/eventBus';

/**
 * Модель плейлиста
 **/
export default class PlaylistModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.playlist = {};
        this.curPagination = 0;
        this.eventBus = eventBus;
        this.eventBus.on(PLAYLIST.GET_PLAYLIST_DATA, this.getPlaylist.bind(this));
        this.eventBus.on(PLAYLIST.GET_TRACKS_DATA, this.getTracks.bind(this));
        this.eventBus.on(PLAYLIST.DELETE_PLAYLIST, this.deletePlaylist.bind(this));
        this.eventBus.on(PLAYLIST.CHANGE_PRIVACY, this.changePrivacy.bind(this));
        this.eventBus.on(PLAYLIST.CHANGE_NAME, this.changeName.bind(this));
        this.eventBus.on(PLAYLIST.CHANGE_IMAGE, this.changeImage.bind(this));
        this.eventBus.on(PLAYLIST.ADD_PLAYLIST, this.addPlaylist.bind(this));
    }

    /**
     * Получение данных плейлиста
     * @param {Object} id
     * @param {boolean} changeEvent были ли изменены данные
     */
    getPlaylist(id, changeEvent = false) {
        Api.playlistGet(id.id).then((res) => {
            switch (res.status) {
            case undefined: // TODO Временно
                this.playlist = res;
                this.eventBus.emit(PLAYLIST.SET_PLAYLIST_ID, this.playlist.id);
                this.eventBus.emit(PLAYLIST.RENDER_PLAYLIST_DATA, this.playlist);
                break;
            case RESPONSE.BAD_REQUEST:
                this.eventBus.emit(PLAYLIST.ERROR,
                    {text: 'Sorry, there isn\'t playlist with this id :('});
                break;
            case RESPONSE.UNAUTH:
            case RESPONSE.NO_ACCESS_RIGHT:
                this.eventBus.emit(PLAYLIST.ERROR,
                    {text: 'Sorry, you can\'t get this playlist :('});
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Получение списка треков
     * @param {string} id
     * @param {string} start
     * @param {string} end
     * @param {boolean} save
     */
    getTracks(id, start, end, save) {
        Api.playlistTracksGet(id, start, end)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json().then((list) => {
                        this.playlist = list;
                        if (this.playlist.tracks.length > 0) {
                            this.eventBus.emit(PLAYLIST.RENDER_TRACKS, {
                                'tracks': this.playlist.tracks,
                                'domItem': 'l-track-list',
                                'type': 'playlist',
                                'startIndex': start,
                            }, save);
                        }
                        this.eventBus.emit(PLAYLIST.SET_TRACKS_AMOUNT, this.playlist.tracks.length);
                    });
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Удаление плейлиста
     * @param {string} playlistID
     */
    deletePlaylist(playlistID) {
        Api.playlistDelete(playlistID).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                this.eventBus.emit(PLAYLIST.RENDER_DELETED);
                this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_DELETION_MESSAGE);
                globalEventBus.emit(GLOBAL.REDIRECT, URL.PROFILE_PLAYLISTS);
                break;
            case RESPONSE.BAD_REQUEST:
                this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_DELETION_ERROR_MESSAGE);
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Изменение приватности плейлиста
     * @param {Object} id
     */
    changePrivacy(id) {
        Api.playlistChangePrivacy(id.toString()).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                break;
            case RESPONSE.BAD_REQUEST:
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Изменение названия плейлиста
     * @param {Object} id
     * @param {String} name
     */
    changeName(id, name) {
        Api.playlistChangeName(id, name).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_NAME_UPDATE_MESSAGE);
                this.eventBus.emit(PLAYLIST.RENDER_NAME, name);
                break;
            case RESPONSE.BAD_REQUEST:
                this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_NAME_UPDATE_ERROR_MESSAGE, true);
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Изменение картинки плейлиста
     * @param {Object} id
     */
    changeImage(id) {
        const fileAttach = document.getElementById('image-upload');
        const resImage = Validation.image(fileAttach.files[0].size, fileAttach.files[0].type
            .split('/').pop().toLowerCase());
        if (resImage !== '') {
            this.eventBus.emit(PLAYLIST.INVALID, {'image-error': resImage});
        } else {
            const fData = new FormData();
            fData.append('playlist_image', fileAttach.files[0], 'kek.png');
            Api.playlistChangeImage(id, fData).then((res) => {
                this.eventBus.emit(PLAYLIST.GET_CSRF_TOKEN);
                switch (res.status) {
                case RESPONSE.OK:
                    this.getPlaylist({id: id}, true);
                    this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_PICTURE_UPDATE_MESSAGE);
                    break;
                case RESPONSE.BAD_REQUEST:
                    this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_PICTURE_UPDATE_ERROR_MESSAGE);
                    this.eventBus.emit(PLAYLIST.INVALID);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(POPUP.NEW, POPUP.SORRY);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
        }
    }

    /**
     * Добавление чужого плейлиста себе :>
     * @param {String} id
     */
    addPlaylist(id) {
        Api.playlistAdd(id).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                res.json().then((playlist) => {
                    globalEventBus.emit(GLOBAL.REDIRECT, `/playlist/${playlist.id}`);
                    this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_ADDITION_MESSAGE);
                });
                break;
            case RESPONSE.BAD_REQUEST:
                this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_ADDITION_ERROR_MESSAGE, true);
                break;
            default:
                this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_ADDITION_ERROR_MESSAGE, true);
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Получение токена
     */
    getCsrfToken() {
        Api.csrfTokenGet().then((res) => {
            User.token = res.headers.get('Csrf-Token');
        });
    }
}
