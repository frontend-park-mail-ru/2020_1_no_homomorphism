import {ALBUM, RESPONSE, PAGINATION} from '@libs/constans';
import Api from '@libs/api';

/**
 * Модель плейлиста
 **/
export default class AlbumModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.album = {};
        this.tracks = {};
        this.curPagination = 0;
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(ALBUM.GET_ALBUM_DATA, this.getAlbum.bind(this));
        this.eventBus.on(ALBUM.GET_TRACKS_DATA, this.getTracks.bind(this));
    }

    /**
     * Получение списка треков
     * @param {Object} id
     */
    getAlbum(id) {
        Api.albumGet(id.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.album = list;
                            this.eventBus.emit(ALBUM.RENDER_ALBUM_DATA, this.album);
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
     * @param {Object} id
     */
    getTracks(id) {
        Api.albumTracksGet(id.id, this.curPagination.toString(), PAGINATION.TRACKS.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.tracks = list.tracks;
                            this.eventBus.emit(ALBUM.RENDER_TRACKS_DATA, this.tracks);
                        });
                    break;
                default:
                    console.error('I am a teapot');
                }
            });
    }
}
