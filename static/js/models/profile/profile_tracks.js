import Api from '@libs/api.js';
import {PROFILE} from '@libs/constans.js';
import {RESPONSE} from '@libs/constans';

/**
 * Модель Профиля
 */
export default class ProfileTracksModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        eventBus.on(PROFILE.ID_TRACKS_SECTION, this.getPlaylists.bind(this));
        this.eventBus = eventBus;
        this.playlists = [];
        this.tracks = [];
        this.loaded = false;
    }

    /**
     * Получение списка треков
     */
    renderTracks() {
        this.eventBus.emit(PROFILE.RENDER_TRACKS, this.tracks);
    }

    /**
     * Получение списка треков
     */
    getTracks() {
        let length = this.playlists.length;
        // eslint-disable-next-line guard-for-in
        for (const playlist in this.playlists) {
            Api.playlistTracksFetch(this.playlists[playlist].id)
                .then((res) => {
                    switch (res.status) {
                    case RESPONSE.OK:
                        res.json()
                            .then((list) => {
                                length--;
                                // eslint-disable-next-line guard-for-in
                                for (const song in list.tracks) {
                                    this.tracks.push(list.tracks[song]);
                                }
                                if (length === 0) { // TODO временное решение
                                    this.renderTracks.bind(this)();
                                }
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

    /**
     * Получение плейлистов
     */
    getPlaylists() {
        Api.profilePlaylistsFetch().then((response) => response.json())
            .then((list) => {
                if (!this.loaded) { // TODO временное решение
                    this.loaded = true;
                    this.playlists = list.playlists;
                    this.getTracks.bind(this)();
                } else {
                    this.renderTracks.bind(this)();
                }
            });
    }
}
