import Api from '@libs/api';
import {RESPONSE} from '@libs/constans';

/**
 * Компонент трек
 */
export default class TrackComponent {
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
     * @param {number} trackID
     */
    getTrackPlaylists(trackID) {
    }

    /**
     * Добавление трека в плейлист
     * @param {string} playlistID
     * @param {function} callback
     */
    addToPlaylist(playlistID, callback) {
        const data = {
            'playlist_id': playlistID,
            'track_id': this._trackData.id,
            'image': this._trackData.image,
        };
        Api.playlistTrackPost(data)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    callback(playlistID);
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

    /**
     * Удлаение трека из плейлиста
     * @param {number} playlistID
     */
    delFromPlaylist(playlistID) {
        Api.playlistTrackDelete(playlistID.toString(), this._trackData.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
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
