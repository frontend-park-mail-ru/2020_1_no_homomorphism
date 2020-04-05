import {PLAYLIST, RESPONSE, PAGINATION} from '@libs/constans';
import Api from '@libs/api';

/**
 * Модель плейлиста
 **/
export default class PlaylistModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.playlist = {};
        this.curPagination = 0;
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(PLAYLIST.GET_PLAYLIST_DATA, this.getPlaylist.bind(this));
        this.eventBus.on(PLAYLIST.GET_TRACKS_DATA, this.getTracks.bind(this));
    }

    /**
     * Получение Данных плейлиста
     * @param {Object} id
     */
    getPlaylist(id) {
        console.log('kek');
        Api.playlistAllTracksFetch(id.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.playlist = list;
                            console.log(list);
                            this.eventBus.emit(PLAYLIST.RENDER_PLAYLIST_DATA,
                                this.playlist.playlist);
                        });
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
     * @param {Object} id
     */
    getTracks(id) {
        Api.playlistTracksFetch(id.id, this.curPagination.toString(), PAGINATION.TRACKS.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.playlist = list;
                            console.log(list);
                            this.eventBus.emit(PLAYLIST.RENDER_TRACKS_DATA, list.tracks);
                        });
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
