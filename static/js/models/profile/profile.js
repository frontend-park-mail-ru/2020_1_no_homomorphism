import Api from '@libs/api';
import {PROFILE, URL, NAVBAR, RESPONSE, GLOBAL} from '@libs/constants';
import User from '@libs/user';
import {globalEventBus} from '@libs/eventBus';

/**
 * Модель Профиля
 */
export default class ProfileModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.curPaginationTracks = 0;
        this.eventBus.on(PROFILE.GET_DATA, this.getUserData.bind(this));
        this.eventBus.on(PROFILE.GET_STAT, this.getUserStat.bind(this));
        this.eventBus.on(PROFILE.ID_TRACKS_SECTION, this.getLikedTracks.bind(this));
        this.eventBus.on(PROFILE.ID_PLAYLISTS_SECTION, this.getPlaylists.bind(this));
        this.eventBus.on(PROFILE.ID_ALBUMS_SECTION, this.getAlbums.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() {
        if (User.exists()) {
            this.eventBus.emit(PROFILE.GET_STAT);
            this.eventBus.emit(PROFILE.RENDER_DATA, User.getUserData());
            return;
        }
        Api.profileGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            User.setUserData(data);
                            this.eventBus.emit(PROFILE.GET_STAT);
                            this.eventBus.emit(PROFILE.RENDER_DATA, User.getUserData());
                        });
                    break;
                case RESPONSE.UNAUTH:
                    globalEventBus.emit(NAVBAR.GET_USER_DATA, {});
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * получает статистику юзера
     */
    getUserStat() {
        Api.profileStatGet(User.getUserData().id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            User.setStatistics(data);
                            this.eventBus.emit(PROFILE.RENDER_STAT, User.getStatistics());
                        });
                    break;
                case RESPONSE.UNAUTH:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получение списка любимых треков
     */
    getLikedTracks() {
        // const playlistID = 94; // СУПЕР ВРЕМЕННО!!!
        // Api.playlistTracksGet(
        //     playlistID.toString(),
        //     this.curPaginationTracks.toString(),
        //     PAGINATION.TRACKS.toString())
        //     .then((res) => {
        //         switch (res.status) {
        //         case RESPONSE.OK:
        //             res.json()
        //                 .then((list) => {
        //                     this.eventBus.emit(PROFILE.SET_PLAYLIST_ID, playlistID);
        //                     this.eventBus.emit(
        //                         PROFILE.RENDER_TRACKS,
        //                         {
        //                             'tracks': list.tracks,
        //                             'domItem': 'l-track-list',
        //                             'type': 'playlist',
        //                         });
        //                 });
        //             break;
        //         case RESPONSE.BAD_REQUEST:
        //         case RESPONSE.UNAUTH:
        //         case RESPONSE.NO_ACCESS_RIGHT:
        //             break;
        //         default:
        //             console.log(res);
        //             console.error('I am a teapot');
        //         }
        //     });
    }

    /**
     * Получение списка плейлистов
     */
    getPlaylists() {
        Api.profilePlaylistsGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.eventBus.emit(
                                PROFILE.RENDER_PLAYLISTS,
                                {
                                    'list': list.playlists,
                                    'domItem': 'l-playlist-list',
                                    'type': 'playlist',
                                });
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
     * Получение списка альбомов
     */
    getAlbums() {
        Api.profileAlbumsGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.albums = list.albums;
                        })
                        .then(() => {
                            this.eventBus.emit(
                                PROFILE.RENDER_PLAYLISTS,
                                {
                                    'list': this.albums,
                                    'domItem': 'l-album-list',
                                    'type': 'album',
                                });
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
