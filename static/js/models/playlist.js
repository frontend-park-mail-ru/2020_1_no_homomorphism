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
        this.eventBus.on(PLAYLIST.GET_USER_DATA, this.getUserData.bind(this));
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
                            this.eventBus.emit(PLAYLIST.GET_USER_DATA);
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

    /**
     * получает данные юзера
     */
    getUserData() {
        console.log('kkkk');
        Api.profileFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(PLAYLIST.RENDER_USER_DATA, data);
                        });
                    break;
                case RESPONSE.UNAUTH:
                    this.eventBus.emit(SETTINGS.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(SETTINGS.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.error('I am a teapot');
                }
            });
    }
}