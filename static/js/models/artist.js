import Api from '@libs/api';
import {ARTIST, URL, GLOBAL} from '@libs/constans';

/**
 * Модель для страницы артиста
 */
export default class ArtistModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.albums = [];
        this.tracks = [];
        this.id = '';
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.globalEventBus.on(GLOBAL.GET_ARTIST_TRACKS, this.getArtistTracks.bind(this));
        this.eventBus.on(ARTIST.GET_DATA, this.getArtistData.bind(this));
        this.eventBus.on(ARTIST.ID_TRACKS_SECTION, this.getArtistTracks.bind(this));
        this.eventBus.on(ARTIST.ID_ALBUMS_SECTION, this.getArtistAlbums.bind(this));
        this.eventBus.on(ARTIST.ID_INFO_SECTION, this.getArtistInfo.bind(this));
    }

    /**
     * Получает артиста из БД
     * @param {number} id
     */
    getArtistData(id) {
        this.id = id.toString();
        Promise.all([
            Api.artistGet(this.id),
            Api.artistStatFetch(this.id),
        ])
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.every((item) => item.ok)) { // TODO Сделать красиво!!!
                    const data = {};
                    Promise.all(res.map((item) => item.json()))
                        .then((res) => res.forEach((item) => Object.assign(data, item)))
                        .then(() => this.eventBus.emit(ARTIST.RENDER_DATA, data));
                } else {
                    this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                }
            });
    }

    /**
     * Получает треки артиста из БД
     * @param {string} start
     * @param {string} end
     */
    getArtistTracks(start, end) {
        Api.artistTracksGet(this.id, start, end)
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.tracks += data.tracks;
                            this.eventBus.emit(ARTIST.RENDER_TRACKS,
                                {
                                    'tracks': data.tracks,
                                    'domItem': 'l-track-list',
                                    'type': 'artist',
                                });
                        });
                } else {
                    this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                }
            });
    }

    /**
     * Получает альбомы артиста из БД
     * @param {string} start
     * @param {string} end
     */
    getArtistAlbums(start, end) {
        Api.artistAlbumsGet(this.id, start, end)
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.albums = data.albums;
                            this.eventBus.emit(ARTIST.RENDER_ALBUMS,
                                {
                                    'list': data.albums,
                                    'domItem': 'l-album-list',
                                    'type': 'album',
                                });
                        });
                } else {
                    this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                }
            });
    }

    /**
     * Получает информацию артиста из БД
     */
    getArtistInfo() {
        // this.eventBus.emit(ARTIST.RENDER_INFO);
    }
}
