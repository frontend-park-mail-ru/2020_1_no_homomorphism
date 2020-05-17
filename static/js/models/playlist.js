import {PLAYLIST, RESPONSE, PAGINATION, URL, GLOBAL, POPUP} from '@libs/constants';
import Api from '@libs/api';
import {globalEventBus} from '@libs/eventBus';

/**
 * Модель плейлиста
 **/
export default class PlaylistModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.playlist = {};
        this.curPagination = 0;
        this.eventBus = eventBus;
        this.eventBus.on(PLAYLIST.GET_PLAYLIST_DATA, this.getPlaylist.bind(this));
        this.eventBus.on(PLAYLIST.GET_TRACKS_DATA, this.getTracks.bind(this));
        this.eventBus.on(PLAYLIST.DELETE_PLAYLIST, this.deletePlaylist.bind(this));
        this.eventBus.on(PLAYLIST.CHANGE_PRIVACY, this.changePrivacy.bind(this));
        this.eventBus.on(PLAYLIST.ADD_PLAYLIST, this.addPlaylist.bind(this));
    }

    /**
     * Получение данных плейлиста
     * @param {Object} id
     */
    getPlaylist(id) {
        Api.playlistGet(id.id).then((res) => {
            switch (res.status) {
            case undefined: // TODO Временно
                this.playlist = res;
                this.eventBus.emit(PLAYLIST.SET_PLAYLIST_ID, this.playlist.id);
                this.eventBus.emit(PLAYLIST.RENDER_PLAYLIST_DATA, this.playlist);
                this.eventBus.emit(PLAYLIST.GET_TRACKS_DATA, {id: this.playlist.id});
                break;
            case RESPONSE.BAD_REQUEST:
                this.eventBus.emit(PLAYLIST.ERROR,
                    {text: 'Sorry, there isn\'t playlist with this id :('});
                break;
            case RESPONSE.UNAUTH:
            case RESPONSE.NO_ACCESS_RIGHT:
                this.eventBus.emit(PLAYLIST.ERROR,
                    {text: 'Sorry, you can\'t get this playlist :('});
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Получение списка треков
     * @param {Object} id
     */
    getTracks(id) {
        Api.playlistTracksGet(id.id, this.curPagination.toString(), PAGINATION.TRACKS.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json().then((list) => {
                        this.playlist = list;
                        if (this.playlist.tracks.length > 0) {
                            this.eventBus.emit(PLAYLIST.RENDER_TRACKS, {
                                'tracks': this.playlist.tracks,
                                'domItem': 'l-track-list',
                                'type': 'playlist',
                            });
                        }
                        this.eventBus.emit(PLAYLIST.SET_TRACKS_AMOUNT, this.playlist.tracks.length);
                    });
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Удаление плейлиста
     * @param {string} playlistID
     */
    deletePlaylist(playlistID) {
        Api.playlistDelete(playlistID).then((res) => {
            switch (res.status) {
            case RESPONSE.OK:
                this.eventBus.emit(PLAYLIST.RENDER_DELETED);
                this.eventBus.emit(POPUP.NEW, POPUP.PLAYLIST_DELETION_MESSAGE);
                globalEventBus.emit(GLOBAL.REDIRECT, URL.PROFILE_PLAYLISTS);
                break;
            case RESPONSE.BAD_REQUEST:
                break;
            default:
                console.log(res);
                console.error('I am a teapot');
            }
        });
    }

    /**
     * Изменение приватности плейлиста
     * @param {Object} id
     */
    changePrivacy(id) {
        Api.playlistChangePrivacy(id.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    break;
                case RESPONSE.BAD_REQUEST:
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Добавление чужого плейлиста себе :>
     * @param {String} id
     */
    addPlaylist(id) {
        Api.playlistAdd(id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((playlist) => { // TODO Добавить попап
                            globalEventBus.emit(GLOBAL.REDIRECT, `/playlist/${playlist.id}`);
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
