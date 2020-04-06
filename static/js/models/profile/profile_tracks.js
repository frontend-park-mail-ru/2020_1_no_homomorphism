import Api from '@libs/api.js';
import {PROFILE, RESPONSE, PAGINATION} from '@libs/constans.js';

/**
 * Модель Профиля
 */
export default class ProfileTracksModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.ID_TRACKS_SECTION, this.getTracks.bind(this));
        this.eventBus = eventBus;
        this.playlists = [];
        this.tracks = [];
        this.curPagination = 0;
        this.loaded = false;
    }

    /**
     * Получение списка треков
     */
    getTracks() {
        Api.playlistTracksFetch(1, this.curPagination.toString(), PAGINATION.TRACKS.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            // for (const song in list.tracks) {
                            //     this.tracks.push(list.tracks[song]);
                            // }
                            this.tracks = list.tracks;
                            this.eventBus.emit(PROFILE.RENDER_TRACKS, this.tracks);
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                case RESPONSE.UNAUTH:
                case RESPONSE.NO_ACCESS_RIGHT:
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    // /**
    //  * Получение плейлистов
    //  */
    // getPlaylists() {
    //     Api.profilePlaylistsFetch()
    //         .then((res) => {
    //             switch (res.status) {
    //             case RESPONSE.OK:
    //                 res.json()
    //                     .then((list) => {
    //                         if (!this.loaded) { // TODO временное решение
    //                             this.loaded = true;
    //                             this.playlists = list.playlists;
    //                             this.getTracks.bind(this)();
    //                         } else {
    //                             this.renderTracks.bind(this)();
    //                         }
    //                     });
    //                 break;
    //             case RESPONSE.BAD_REQUEST: // TODO Плейлиста не существует
    //                 break;
    //             case RESPONSE.UNAUTH: // TODO Пользователь не залогинен => дефолтный плейлист
    //             case RESPONSE.NO_ACCESS_RIGHT: // TODO Нет прав к этому плейлисту
    //                 break;
    //             default:
    //                 console.log(res);
    //                 console.error('I am a teapot');
    //             }
    //         });
    // }
}
