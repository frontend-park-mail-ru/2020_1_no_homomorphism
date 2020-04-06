import {PLAYLIST, RESPONSE, SETTINGS, URL} from '@libs/constans';
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
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(PLAYLIST.GET_PLAYLIST_DATA, this.getTracks.bind(this));
    }

    /**
     * Получение списка треков
     * @param {Object} id
     */
    getTracks(id) {
        Api.playlistTracksFetch(id.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.playlist = list;
                            this.eventBus.emit(PLAYLIST.RENDER_DATA, this.playlist);
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    this.eventBus.emit(PLAYLIST.ERROR, {text: 'Sorry, there isnt playlist with this id :('});
                    break;
                case RESPONSE.UNAUTH:
                case RESPONSE.NO_ACCESS_RIGHT:
                    this.eventBus.emit(PLAYLIST.ERROR, {text: 'Sorry, you cant get this playlist :('});
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
