import Api from '@libs/api.js';
import {PROFILE} from '@libs/constans.js';
import {RESPONSE} from '@libs/constans';

/**
 * Модель альбомов профиля
 */
export default class ProfileAlbumsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.ID_ALBUMS_SECTION, this.getAlbums.bind(this));
        this.eventBus = eventBus;
        this.playlist = [];
    }

    /**
     * Получение списка альбомов
     */
    getAlbums() {
        Api.profilePlaylistsFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                .then((list) => {
                    this.playlists = list.playlists;
                })
                    .then(() => {
                        this.eventBus.emit(PROFILE.RENDER_PLAYLISTS, this.playlists);
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
