import artist from '@views/artist/artist.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/track_list/track_list';
import PlaylistsComponent from '@components/playlist_list/playlist_list';
import {ARTIST, DOM} from '@libs/constants';

/**
 *  вью для страницы артиста
 */
export default class ArtistView extends BaseView {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(artist);
        this.data = {};
        this.tracksRendered = 0;
        this.allTracksRendered = true;
        this.albumsRendered = 0;
        this.allAlbumsRendered = true;
        this.id = 0;
        this.currentOpen = '';
        this.trackListComponent = new TrackListComponent(eventBus, ARTIST);
        this.playlistsComponent = new PlaylistsComponent(eventBus, ARTIST);
        this.eventBus = eventBus;
        this.eventBus.on(ARTIST.RENDER_DATA, this.renderData.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        console.log(url);
        super.render(document.getElementsByClassName(DOM.CONTENT)[0], url);
        this.analizeUrl(url);
        this.eventBus.emit(ARTIST.GET_DATA, this.id);
        this.chooseSection(url);
    }

    /**
     * Парсит урл
     * @param {string} url
     */
    analizeUrl(url) {
        this.id = (url.indexOf('/') === -1 ? url : url.slice(0, url.indexOf('/'))
        );
        this.currentOpen = (url.indexOf('/') === -1 ?
            'tracks' :
            url.slice(url.indexOf('/') + 1, url.length));
    }

    /**
     * Определение секции нажатия
     * @param {string} url
     */
    chooseSection(url) {
        const curSection = document.getElementById(`profile-${this.currentOpen}-title`);
        curSection.classList.add(ARTIST.SELECTED_CLASS);
        this.eventBus.emit(`artist-${this.currentOpen}`, '0', '50');
    }

    /**
     * Рендер
     * @param {Object} data
     */
    renderData(data) {
        this.setData(data);
        this.eventBus.emit(ARTIST.SET_ARTIST_ID, data.id);
        document.getElementsByClassName('m-top-login')[0].innerHTML = data.name;
        document.getElementsByClassName('m-round-image')[0].src = data.image;
        document.getElementsByClassName('m-top-name')[0].innerHTML = data.genre;
        document.getElementsByClassName('m-top-section-tracks-ref')[0].href =
            `/artist/${data.id}/tracks`;
        document.getElementsByClassName('m-top-section-albums-ref')[0].href =
            `/artist/${data.id}/albums`;
        document.getElementsByClassName('l-top-section-info-ref')[0]
            .href = `/artist/${data.id}/info`;
        document.getElementById('artist-tracks-title').innerText = data.tracks;
        document.getElementById('artist-albums-title').innerText = data.albums;
    }
}
