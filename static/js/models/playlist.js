import {PLAYLIST, RESPONSE} from '@libs/constans';
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
        this.eventBus.on(PLAYLIST.GET_DATA, this.getTracks.bind(this));
    }

    /**
     * Получение списка треков
     * @param {number} id
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
                case RESPONSE.BAD_REQUEST: // TODO Плейлиста не существует
                    break;
                case RESPONSE.UNAUTH: // TODO Пользователь не залогинен => дефолтный плейлист
                case RESPONSE.NO_ACCESS_RIGHT: // TODO Нет прав к этому плейлисту
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}