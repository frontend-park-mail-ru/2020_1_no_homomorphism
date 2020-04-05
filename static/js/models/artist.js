import Api from '@libs/api.js';
import {ARTIST, URL} from '@libs/constans.js';

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
        this.eventBus = eventBus;
        this.eventBus.on(ARTIST.SET_ID, this.setId.bind(this));
        this.eventBus.on(ARTIST.GET_DATA, this.getArtistData.bind(this));
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
        Api.artistFetch(this.id)
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(ARTIST.RENDER_DATA, data);
                        });
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
        if (this.albums.length === 0) {
            Api.artistAlbumsFetch(this.id, '0', '100')
                .then((res) => {
                    if (res === undefined) {
                        this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                        return;
                    }
                    if (res.ok) {
                        res.json()
                            .then((data) => {
                                this.albums = data.albums;
                            });
                    } else {
                        this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                    }
                })
                .then(() => {
                    for (let i = 0; i < this.albums.length && this.tracks.length < parseInt(end);
                        i++) {
                        Api.albumFetch(this.albums[i].id)
                            .then((res) => {
                                if (res === undefined) {
                                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                                    return;
                                }
                                if (res.ok) {
                                    res.json()
                                        .then((data) => {
                                            for (const track of data.tracks) {
                                                this.tracks.push(track);
                                            }
                                        });
                                } else {
                                    this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                                }
                            })
                            .then(() => {
                                this.eventBus.emit(ARTIST.RENDER_TRACKS, this.tracks);
                            });
                    }
                });
        } else {
            for (let i = 0; i < this.albums.length && this.tracks.length < parseInt(end); i++) {
                Api.albumFetch(this.albums[i].id)
                    .then((res) => {
                        if (res === undefined) {
                            this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                            return;
                        }
                        if (res.ok) {
                            res.json()
                                .then((data) => {
                                    for (const track of data.tracks) {
                                        this.tracks.push(track);
                                    }
                                });
                        } else {
                            this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                        }
                    });
            }
            this.eventBus.emit(ARTIST.RENDER_TRACKS, this.tracks);
        }
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
    getArtistInfo() {}
}
