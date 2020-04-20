import Api from '@libs/api';
import {GLOBAL, RESPONSE, URL} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

/**
 * Компонент трек
 */
export default class PlaylistComponent {
    /**
     * конструктор
     */
    constructor() {
        this._trackData = {};
    }

    /**
     * Запись данных о треке
     * @param {Object} data
     */
    set trackData(data) {
        this._trackData = data;
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
     * @param {string} playlistName
     */
    createPlaylist(playlistName) {
        Api.playlistPost(playlistName)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK_ADDED:
                    console.log(res);
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
