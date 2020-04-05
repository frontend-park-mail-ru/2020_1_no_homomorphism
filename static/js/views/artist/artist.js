import artist from '@views/artist/artist.tmpl.xml';
import albumsTemplate from '@views/artist/artist_albums.tmpl.xml';
import tracksTemplate from '@views/artist/artist_tracks.tmpl.xml';
import BaseView from '@libs/base_view';
import {ARTIST, DOM, GLOBAL, PAGINATION} from '@libs/constans';
import '@css/base.css';

/**
 *  вью для страницы артиста
 */
export default class ArtistView extends BaseView {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        super(artist);
        this.tracksRendered = 0;
        this.allTracksRendered = true;
        this.albumsRendered = 0;
        this.allAlbumsRendered = true;
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(ARTIST.RENDER_DATA, this.renderData.bind(this));
        this.eventBus.on(ARTIST.RENDER_ALBUMS, this.renderAlbums.bind(this));
        this.eventBus.on(ARTIST.RENDER_TRACKS, this.renderTracks.bind(this));
        // this.eventBus.on(ARTIST.RENDER_INFO, this.renderInfo.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {srting} url
     */
    render(root, url) {
        this.tracksRendered = 0;
        this.allTracksRendered = true;
        this.albumsRendered = 0;
        this.allAlbumsRendered = true;
        this.id = url.indexOf('/') === -1 ? url : url.slice(0, url.indexOf('/'));
        this.eventBus.emit(ARTIST.SET_ID, this.id);
        if (JSON.stringify(this.data) === '{}') {
            this.eventBus.emit(ARTIST.GET_DATA);
            this.setData({id: this.id});
        }
        super.render(document.getElementsByClassName(DOM.CONTENT)[0], url);
        this.currentOpen = url.indexOf('/') === -1 ? 'tracks' :
            url.slice(url.indexOf('/') + 1, url.length);
        switch (this.currentOpen) {
        case ARTIST.ID_TRACKS_SECTION:
            this.eventBus.emit(this.currentOpen, this.tracksRendered.toString(),
                (this.tracksRendered + PAGINATION.TRACKS).toString());
            break;
        case ARTIST.ID_ALBUMS_SECTION:
            this.eventBus.emit(this.currentOpen, this.albumsRendered.toString(),
                (this.albumsRendered + PAGINATION.ALBUMS).toString());
            break;
        case ARTIST.ID_INFO_SECTION:
            this.eventBus.emit(this.currentOpen);
            break;
        }
    }

    /**
     * Рендер
     * @param {Object} data
     */
    renderData(data) {
        this.setData(data);
        document.getElementsByClassName('m-top-login')[0].innerHTML = data.name;
        document.getElementsByClassName('m-round-image')[0].src = data.image;
        document.getElementsByClassName('m-top-name')[0].innerHTML = data.genre;
        document.getElementById('artist-tracks-title').innerText = data.tracks;
        this.allTracksRendered = parseInt(data.tracks) < PAGINATION.TRACKS;
        document.getElementById('artist-albums-title').innerText = data.albums;
        this.allAlbumsRendered = parseInt(data.albums) < PAGINATION.ALBUMS;
    }

    /**
     * Рендер альбомов
     * @param {Object} albums
     */
    renderAlbums(albums) {
        this.albumsRendered += albums.length;
        this.allAlbumsRendered = albums.length < PAGINATION.ALBUMS;
        const elem = document.getElementById('albums');
        elem.innerHTML += albumsTemplate(albums);
        this.setAlbumsEventListeners();
    }

    /**
     * Set EventListeners
     */
    setAlbumsEventListeners() {
        document.querySelectorAll('.l-list-card').forEach((playlist) => {
            playlist.onclick = (event) => this.albumClick.bind(this)(event);
        });
        window.removeEventListener('wheel', this.tracksListWheel.bind(this));
        if (this.allAlbumsRendered) {
            return;
        }
        window.addEventListener('wheel', this.albumsListWheel.bind(this));
    }

    /**
     * Слушает клик по альбому
     * @param {Object} event
     */
    albumClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-list-card' &&
                current.getAttribute('a-id') !== null) {
                this.globalEventBus.emit(GLOBAL.PLAY_ALBUM, {id: current.getAttribute('a-id')});
                break;
            } else {
                current = current.parentNode;
            }
        }
    }

    /**
     * Слушает скрол по списку альбомов
     */
    albumsListWheel() {
        if (this.allAlbumsRendered) {
            return;
        }
        const list = document.getElementsByClassName('l-profile-album-list')[0];
        const bottom = document.documentElement.clientHeight;
        if (list.getBoundingClientRect().bottom > bottom &&
            list.getBoundingClientRect().bottom < bottom + 320
        ) {
            this.eventBus.emit(this.currentOpen, this.albumsRendered.toString(),
                (this.albumsRendered + PAGINATION.ALBUMS).toString());
        }
    }

    /**
     * Рендер треков
     * @param {Object} tracks
     */
    renderTracks(tracks) {
        this.tracksRendered += tracks.length;
        this.allTracksRendered = tracks.length < PAGINATION.TRACKS;
        const elem = document.getElementById('tracks');
        elem.innerHTML += tracksTemplate(tracks);
        this.setTracksEventListeners();
    }

    /**
     * Set EventListeners
     */
    setTracksEventListeners() {
        document.querySelectorAll('.l-track-big').forEach((track) => {
            track.onclick = (event) => this.trackClick.bind(this)(event);
        });
        window.removeEventListener('wheel', this.albumsListWheel.bind(this));
        if (this.allTracksRendered) {
            return;
        }
        window.addEventListener('wheel', this.tracksListWheel.bind(this));
    }

    /**
     * Слушает клик по треку
     * @param {Object} event
     */
    trackClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-track-big' &&
                current.getAttribute('a-id') !== null) {
                this.globalEventBus.emit(GLOBAL.PLAY_ARTIST_TRACKS, this.id,
                    current.getAttribute('a-id'));
                break;
            } else {
                current = current.parentNode;
            }
        }
    }

    /**
     * Слушает скрол по списку треков
     */
    tracksListWheel() {
        if (this.allTracksRendered) {
            return;
        }
        const list = document.getElementsByClassName('l-profile-track-list')[0];
        const bottom = document.documentElement.clientHeight;
        if (list.getBoundingClientRect().bottom > bottom &&
            list.getBoundingClientRect().bottom < bottom + 320
        ) {
            this.eventBus.emit(this.currentOpen, this.tracksRendered.toString(),
                (this.tracksRendered + PAGINATION.TRACKS).toString());
        }
    }

    /**
     * Рендер информации
     */
    // renderInfo(info) {}

    /**
     * @param {Object} data
     */
    setData(data) {
        super.setData(data);
    }
}
