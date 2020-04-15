import Api from '@libs/api';
import {PROFILE, URL, NAVBAR, RESPONSE, PAGINATION} from '@libs/constans';
import User from '@libs/user';

/**
 * Модель Профиля
 */
export default class ProfileModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
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
        Api.profileFetch()
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
                    this.globalEventBus.emit(NAVBAR.GET_USER_DATA, {});
                    this.eventBus.emit(PROFILE.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(PROFILE.REDIRECT, URL.MAIN);
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
        Api.profileStatFetch(User.getUserData().id)
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
                    this.eventBus.emit(PROFILE.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(PROFILE.REDIRECT, URL.MAIN);
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
        Api.playlistTracksFetch(
            8,
            this.curPaginationTracks.toString(),
            PAGINATION.TRACKS.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((list) => {
                            this.eventBus.emit(
                                PROFILE.RENDER_TRACKS,
                                list.tracks, 'l-profile-track-list');
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

    /**
     * Получение списка плейлистов
     */
    getPlaylists() {
        Api.profilePlaylistsFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        // .then((list) => {
                        //     this.playlists = list.playlists;
                        // })
                        .then((list) => {
                            this.eventBus.emit(
                                PROFILE.RENDER_PLAYLISTS,
                                list.playlists,
                                'l-profile-playlist-list',
                                'playlist');
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
        Api.profileAlbumsFetch()
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
                                this.albums,
                                'l-profile-album-list',
                                'album');
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
