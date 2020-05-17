import Api from '@libs/api';
import {ARTIST, URL, GLOBAL, RESPONSE} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';

/**
 * Модель для страницы артиста
 */
export default class ArtistModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.albums = [];
        this.tracks = [];
        this.id = '';
        this.eventBus = eventBus;
        this.eventBus.on(ARTIST.GET_DATA, this.getArtistData.bind(this));
        this.eventBus.on(ARTIST.ID_TRACKS_SECTION, this.getArtistTracks.bind(this));
        this.eventBus.on(ARTIST.ID_ALBUMS_SECTION, this.getArtistAlbums.bind(this));
        this.eventBus.on(ARTIST.ID_INFO_SECTION, this.getArtistInfo.bind(this));
        this.eventBus.on(ARTIST.SUBSCRIBE, this.subscribe.bind(this));
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
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.every((item) => item.ok)) { // TODO Сделать красиво!!!
                    const data = {};
                    Promise.all(res.map((item) => item.json()))
                        .then((res) => res.forEach((item) => Object.assign(data, item)))
                        .then(() => {
                            this.eventBus.emit(ARTIST.RENDER_DATA, data);
                        });
                } else {
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
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
                switch (res.status) {
                case RESPONSE.OK:
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
                    break;
                default:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
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
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.albums = data.albums;
                            this.eventBus.emit(ARTIST.RENDER_ALBUMS,
                                {
                                    'list': data.albums,
                                    'domItem': 'l-track-list',
                                    'type': 'album',
                                });
                        });
                    break;
                default:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                }
            });
    }

    /**
     * Подписка на артиста
     * @param {String} id
     */
    subscribe(id) {
        Api.artistSubscribe(id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    console.log('SUCCESS');
                    break;
                default:
                    console.log('Error');
                    return;
                }
            });
    }

    /**
     * Получает информацию артиста из БД
     */
    getArtistInfo() {
        alert('This functionality is not accessible by now');
    }
}
