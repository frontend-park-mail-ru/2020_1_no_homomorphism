import Api from '@libs/api.js';
import {ARTIST, URL, GLOBAL} from '@libs/constans.js';
import {RESPONSE} from '@libs/constans';

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
        this.artists = [];
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.globalEventBus.on(GLOBAL.GET_ARTIST_TRACKS, this.getArtistTracks.bind(this));
        this.eventBus.on(ARTIST.SET_ID, this.setId.bind(this));
        this.eventBus.on(ARTIST.GET_DATA, this.getArtistData.bind(this));
        this.eventBus.on(ARTIST.GET_LIST_DATA, this.getArtistListData.bind(this));
        this.eventBus.on(ARTIST.ID_TRACKS_SECTION, this.getArtistTracks.bind(this));
        this.eventBus.on(ARTIST.ID_ALBUMS_SECTION, this.getArtistAlbums.bind(this));
        this.eventBus.on(ARTIST.ID_INFO_SECTION, this.getArtistInfo.bind(this));
    }

    /**
     * sets id
     * @param {string} id
     */
    setId(id) {
        this.id = id;
    }

    /**
     * Получает артиста из БД
     */
    getArtistData() {
        Promise.all([
            Api.artistFetch(this.id),
            Api.artistStatFetch(this.id),
        ])
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.every((item) => item.ok)) {
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
     * Получает списка артистов
     */
    getArtistListData() {
        Api.artistListFetch('0', '100')
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.artists = data.artists;
                            this.eventBus.emit(ARTIST.RENDER_ARTIST_LIST, this.artists);
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получает треки артиста из БД
     * @param {string} start
     * @param {string} end
     */
    getArtistTracks(start, end) {
        Api.artistTracksFetch(this.id, start, end)
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.tracks += data.tracks;
                            this.eventBus.emit(ARTIST.RENDER_TRACKS, data.tracks);
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
        Api.artistAlbumsFetch(this.id, start, end)
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.albums = data.albums;
                            this.eventBus.emit(ARTIST.RENDER_ALBUMS, data.albums);
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
