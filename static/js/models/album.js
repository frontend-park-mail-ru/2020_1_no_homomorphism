import {ALBUM, RESPONSE, SETTINGS, URL} from '@libs/constans';
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
        this.playlist = {};
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(ALBUM.GET_ALBUM_DATA, this.getAlbumTracks.bind(this));
    }

    /**
     * Получение списка треков
     * @param {Object} id
     */
    getAlbumTracks(id) {
        Api.albumFetch(id.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.playlist = list;
                            this.eventBus.emit(ALBUM.RENDER_DATA, this.playlist);
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    console.log(res);
                    this.eventBus.emit(ALBUM.ERROR, {text: 'Sorry, there isnt album with this id :('});
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
