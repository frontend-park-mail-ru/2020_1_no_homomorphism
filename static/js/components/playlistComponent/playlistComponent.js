import Api from '@libs/api';
import {GLOBAL, RESPONSE, URL} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

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
     * Получение плейлистов трека
     * @param {function} callback
     */
    getProfilePlaylistsApi(callback) {
        Api.profilePlaylistsGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            callback(list.playlists);
                        });
                    break;
                case RESPONSE.UNAUTH:
                case RESPONSE.NO_ACCESS_RIGHT:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.SIGN_UP);
                    break;
                case RESPONSE.BAD_REQUEST:
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Создание плейлиста
     * @param {function} callback
     * @param {string} playlistName
     */
    createPlaylist(callback, playlistName) {
        Api.playlistPost(playlistName)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK_ADDED:
                    res.json()
                        .then((res) => {
                            callback({
                                'name': playlistName,
                                'id': res.playlist_id,
                            });
                            this._setEventListeners();
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    console.log('ALREADY ADDED');
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
