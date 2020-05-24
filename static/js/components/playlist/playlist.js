import Api from '@libs/api';
// import {GLOBAL, RESPONSE, URL, POPUP} from '@libs/constants';
import {RESPONSE, POPUP} from '@libs/constants';
// import {globalEventBus} from '@libs/eventBus';
import PopUp from '@components/pop-up/pop-up';
import Validation from '@libs/validation';
import User from '@libs/user';

/**
 * Компонент трек
 */
export default class PlaylistComponent {
    /**
     * конструктор
     * @param {function} _setEventListeners
     */
    constructor(_setEventListeners) {
        this._setEventListeners = _setEventListeners;
    }
    /**
     * Получение плейлистов пользователя
     * @param {function} callback
     */
    getProfilePlaylistsApi(callback) {
        // Api.profilePlaylistsGet().then((res) => {
        //     switch (res.status) {
        //     case RESPONSE.OK:
        //         res.json().then((list) => {
        //             callback(list.playlists);
        //         });
        //         break;
        //     case RESPONSE.UNAUTH:
        //     case RESPONSE.NO_ACCESS_RIGHT:
        //         globalEventBus.emit(GLOBAL.REDIRECT, URL.SIGN_UP);
        //         break;
        //     case RESPONSE.BAD_REQUEST:
        //     default:
        //         console.log(res);
        //         console.error('I am a teapot');
        //     }
        // });
    }

    /**
     * Получение плейлиста
     * @param {String} id
     * @param {function} callback
     */
    getPlaylist(id, callback) {
        Api.playlistGet(id).then((res) => {
            callback(id, res.image);
        });
    }

    /**
     * Создание плейлиста
     * @param {function} callback
     * @param {string} playlistName
     */
    createPlaylist(callback, playlistName) {
        Api.playlistPost(playlistName).then((res) => {
            switch (res.status) {
            case RESPONSE.OK_ADDED:
                res.json().then((res) => {
                    callback({
                        'name': playlistName,
                        'id': res.playlist_id,
                    });
                    this._setEventListeners();
                });
                new PopUp(POPUP.PLAYLIST_CREATION_MESSAGE);
                break;
            case RESPONSE.BAD_REQUEST:
                new PopUp(POPUP.PLAYLIST_CREATION_ERROR_MESSAGE, true);
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Удаление плейлиста
     * @param {function} callback
     * @param {string} id
     */
    deletePlaylist(callback, id) {
        Api.playlistDelete(id).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                callback({'id': id});
                this._setEventListeners();
                new PopUp(POPUP.PLAYLIST_DELETION_MESSAGE);
                break;
            case RESPONSE.BAD_REQUEST:
                new PopUp(POPUP.PLAYLIST_DELETION_ERROR_MESSAGE, true);
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Изменение названия плейлиста
     * @param {string} id
     * @param {string} name
     * @param {function} callback
     */
    changeName(id, name, callback) {
        Api.playlistChangeName(id, name).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                callback(id, name, '');
                new PopUp(POPUP.PLAYLIST_NAME_UPDATE_MESSAGE);
                break;
            case RESPONSE.BAD_REQUEST:
                new PopUp(POPUP.PLAYLIST_NAME_UPDATE_ERROR_MESSAGE, true);
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Изменение картинки плейлиста
     * @param {string} id
     * @param {HTMLElement} fileAttach
     * @param {function} callback
     */
    changeImage(id, fileAttach, callback) {
        const resImage = Validation.image(fileAttach.files[0].size, fileAttach.files[0].type
            .split('/').pop().toLowerCase());
        if (resImage !== '') {
            new PopUp(resImage, true);
        } else {
            const fData = new FormData();
            fData.append('playlist_image', fileAttach.files[0], 'kek.png');
            Api.playlistChangeImage(id, fData).then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.getCsrfToken();
                    new PopUp(POPUP.PLAYLIST_PICTURE_UPDATE_MESSAGE);
                    callback(id, '', 'kek.png');
                    break;
                case RESPONSE.BAD_REQUEST:
                    new PopUp(POPUP.PLAYLIST_PICTURE_UPDATE_ERROR_MESSAGE);
                    break;
                case RESPONSE.SERVER_ERROR:
                    new PopUp(POPUP.SORRY);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
        }
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
