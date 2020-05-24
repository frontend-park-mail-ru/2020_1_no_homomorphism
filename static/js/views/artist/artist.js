import artist from '@views/artist/artist.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/track_list/track_list';
import PlaylistsComponent from '@components/playlist_list/playlist_list';
import {GLOBAL, ARTIST, DOM, POPUP} from '@libs/constants';
import User from '@libs/user';
import PopUp from '@components/pop-up/pop-up';
import {inputSanitize} from '@libs/input_sanitize';
import {globalEventBus} from '@libs/eventBus';

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
        this.id = 0;
        this.currentOpen = '';
        this.textSubscribe = '';
        this.trackListComponent = new TrackListComponent(eventBus, ARTIST);
        this.playlistsComponent = new PlaylistsComponent(eventBus, ARTIST.RENDER_ALBUMS);
        this.eventBus = eventBus;
        this.eventBus.on(ARTIST.RENDER_DATA, this.renderData.bind(this));
        this.eventBus.on(ARTIST.DRAW_SUBSCRIBE, this.drawSubscribe.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
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
        this.id = (url.indexOf('/') === -1 ? url : url.slice(0, url.indexOf('/')));
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
        super.setData(data);
        this.eventBus.emit(ARTIST.SET_ARTIST_ID, data.id);
        document.getElementsByClassName('m-top-login')[0].innerHTML = inputSanitize(data.name);
        document.getElementsByClassName('m-round-image')[0].src = data.image;
        document.getElementsByClassName('m-top-name')[0].innerHTML = inputSanitize(data.genre);
        document.getElementsByClassName('m-top-section-tracks-ref')[0].href =
            `/artist/${data.id}/tracks`;
        document.getElementsByClassName('m-top-section-albums-ref')[0].href =
            `/artist/${data.id}/albums`;
        document.getElementsByClassName('l-top-section-info-ref')[0]
            .href = `/artist/${data.id}/info`;
        document.getElementById('artist-tracks-title').innerText = data.tracks;
        document.getElementById('artist-albums-title').innerText = data.albums;
        this.setEventListeners.bind(this)();
        this.textSubscribe = 'Subscribe';
        if (data.is_subscribed) {
            this.textSubscribe = 'Unsubscribe';
            document.getElementsByClassName('m-subscribe')[0].classList.toggle('is-subscribed');
        }
        document.getElementsByClassName('m-subscribe')[0].innerHTML =
            inputSanitize(this.textSubscribe);
    }

    /**
     * Set event listeners
     */
    setEventListeners() {
        document.getElementsByClassName('m-subscribe')[0]
            .addEventListener('click', this.subscribe.bind(this));
        document.getElementsByClassName('l-button-middle-play')[0]
            .addEventListener('click', this.playArtistTracks.bind(this));
    }

    /**
     * Проигрование всех треков артиста
     */
    playArtistTracks() {
        console.log(this);
        if (this._data.tracks === 0) {
            return;
        }
        globalEventBus.emit(GLOBAL.PLAY_ARTIST_TRACKS, this.id,
            document.getElementsByClassName('l-track-big')[0].getAttribute('t-id'),
            this._data.tracks);
    }

    /**
     * Subscribe
     */
    subscribe() {
        this.eventBus.emit(ARTIST.SUBSCRIBE, this.data.id);
    }

    /**
     * Subscribe result
     * @param {Boolean} success
     */
    drawSubscribe(success) {
        if (!success) {
            if (this.textSubscribe === 'Subscribe') {
                new PopUp(POPUP.ARTIST_SUBSCRIPTION_ERROR_MESSAGE + this.data.name, true);
            } else {
                new PopUp(POPUP.ARTIST_UNSUBSCRIPTION_ERROR_MESSAGE + this.data.name, true);
            }
            return;
        }
        if (this.textSubscribe === 'Subscribe') {
            new PopUp(POPUP.ARTIST_SUBSCRIPTION_MESSAGE + this.data.name);
        } else {
            new PopUp(POPUP.ARTIST_UNSUBSCRIPTION_MESSAGE + this.data.name);
        }
        if (User.exists()) {
            const button = document.getElementsByClassName('m-subscribe')[0];
            this.textSubscribe = button.classList.contains('is-subscribed') ?
                'Subscribe' : 'Unsubscribe';
            button.classList.add('is-invisible');
            button.classList.toggle('is-subscribed');
            button.innerText = this.textSubscribe;
            setTimeout(() => {
                button.classList.remove('is-invisible');
            }, 100);
        }
    }
}
