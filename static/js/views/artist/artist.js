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
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(ARTIST.RENDER_DATA, this.renderData.bind(this));
        this.eventBus.on(ARTIST.RENDER_ALBUMS, this.renderAlbums.bind(this));
        this.eventBus.on(ARTIST.RENDER_TRACKS, this.renderTracks.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {srting} url
     */
    render(root, url) {
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
            this.eventBus.emit(this.currentOpen, '0', PAGINATION.TRACKS.toString());
            break;
        case ARTIST.ID_ALBUMS_SECTION:
            this.eventBus.emit(this.currentOpen, '0', PAGINATION.ALBUMS.toString());
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
        // document.getElementsByClassName('m-artist-background')[0].src = data.image;
        // document.getElementsByClassName('m-artist-background')[1].src = data.image;
    }

    /**
     * Рендер альбомов
     * @param {Object} albums
     */
    renderAlbums(albums) {
        const elem = document.getElementById('albums');
        elem.innerHTML += albumsTemplate(albums);
        this.setEventListeners();
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.querySelectorAll('.l-list-card').forEach((playlist) => {
            playlist.onclick = (event) => this.albumClick.bind(this)(event);
        });
    }

    /**
     * Слушает клик по альбому
     * @param {Object} event
     */
    albumClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-list-card' &&
                current.getAttribute('id') !== null) {
                this.globalEventBus.emit(GLOBAL.PLAY_ALBUM, {id: current.getAttribute('id')});
                break;
            } else {
                current = current.parentNode;
            }
        }
    }

    /**
     * Рендер треков
     * @param {Object} tracks
     */
    renderTracks(tracks) {
        const elem = document.getElementById('tracks');
        elem.innerHTML += tracksTemplate(tracks);
    }

    /**
     * @param {Object} data
     */
    setData(data) {
        super.setData(data);
    }
}
