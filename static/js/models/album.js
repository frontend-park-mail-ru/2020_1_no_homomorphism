import {ALBUM, RESPONSE, PAGINATION} from '@libs/constans';
import Api from '@libs/api';

/**
 * Модель плейлиста
 **/
export default class AlbumModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.album = {};
        this.tracks = {};
        this.curPagination = 0;
        this.eventBus = eventBus;
        this.eventBus.on(ALBUM.GET_ALBUM_DATA, this.getAlbum.bind(this));
        this.eventBus.on(ALBUM.GET_TRACKS_DATA, this.getTracks.bind(this));
    }

    /**
     * Получение списка треков
     * @param {Object} data
     */
    getAlbum(data) {
        Api.albumGet(data.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.album = list;
                            this.eventBus.emit(ALBUM.RENDER_ALBUM, this.album);
                            this.eventBus.emit(ALBUM.SET_ALBUM_ID, data.id);
                            this.eventBus.emit(ALBUM.GET_TRACKS_DATA, data.id);
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    this.eventBus.emit(ALBUM.ERROR,
                        {text: 'Sorry, there isn\'t album with this id :('});
                    break;
                default:
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получение данных альбома
     * @param {number} id
     */
    getTracks(id) {
        Api.albumTracksGet(id, this.curPagination.toString(), PAGINATION.TRACKS.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.tracks = list.tracks;
                            this.eventBus.emit(ALBUM.RENDER_TRACKS, {
                                'tracks': this.tracks,
                                'domItem': 'l-track-list',
                                'type': 'album',
                            });
                            this.eventBus.emit(ALBUM.SET_TRACKS_AMOUNT, this.tracks);
                        });
                    break;
                default:
                    console.error('I am a teapot');
                }
            });
    }
}
