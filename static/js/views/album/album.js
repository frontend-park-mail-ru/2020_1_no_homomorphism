import {ALBUM, GLOBAL} from '@libs/constans.js';
import playlist from '@views/album/album.tmpl.xml';
import tracks from '@views/template/tracks.tmpl.xml';
import BaseView from '@libs/base_view';

/**
 *  вью для входа
 */
export default class AlbumView extends BaseView {
    /**
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        super(playlist);
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.albumData = {};
        this.tracksData = {};
        this.eventBus.on(ALBUM.RENDER_ALBUM_DATA, this.setAlbumData.bind(this));
        this.eventBus.on(ALBUM.RENDER_TRACKS_DATA, this.setTracksData.bind(this));
        this.eventBus.on(ALBUM.ERROR, this.showErrors.bind(this));
    }

    /**
     * рендерит страницу плейлиста
     *  @param {Object} root
     *  @param {string} url
     */
    render(root, url) {
        super.render(root);
        this.eventBus.emit(ALBUM.GET_ALBUM_DATA, {id: url});
        this.eventBus.emit(ALBUM.GET_TRACKS_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные альбома
     * @param {Object} album
     */
    setAlbumData(album) {
        this.albumData = album;
        this.renderAlbum();
        // this.renderTracks();
    }

    /**
     * Выводит данные альбома
     */
    renderAlbum() {
        document.getElementsByClassName('m-name')[0].innerHTML = this.albumData.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.albumData.image;
    }

    /**
     * Вставляет необходимые данные треков
     * @param {Object} tracks
     */
    setTracksData(tracks) {
        this.tracksData = tracks;
        this.renderTracks();
        // this.renderTracks();
    }

    /**
     * Выводит данные трека
     */
    renderTracks() {
        if (this.tracksData.length === 0) {
            return;
        }
        document.getElementsByClassName('l-track-list')[0].innerHTML = tracks(this.tracksData);
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Amount of tracks: ' +
            this.tracksData.length;
        document.getElementsByClassName('l-track-list')[0].className += ' l-profile-base';
        this.seEventListeners();
    }

    /**
     * Слушает события
     */
    seEventListeners() {
        document.querySelectorAll('.l-track-big').forEach((row) => { // TODO Никитуля, отсылочка вам
        });
        document.querySelectorAll('img.m-big-more-button').forEach((button) => { // TODO Обработать
        });
        document.querySelectorAll('img.m-big-like-button').forEach((button) => {
            button.onclick = (event) => this.likeClicked(event);
        });
        document.querySelectorAll('img.m-big-add-button').forEach((button) => { // TODO выбор, в какой плейлист добавить
        });
        document.getElementsByClassName('m-button-track-list-play')[0].addEventListener('click',
            this.playAlbum.bind(this));
    }

    /**
     * Проигрование плейлиста
     */
    playAlbum() {
        this.globalEventBus.emit(GLOBAL.PLAY_ALBUM, {id: this.albumData.album.id});
    }

    /**
     * Выводит ошибку
     * @param {Object} error
     */
    showErrors(error) {
        document.getElementsByClassName('l-top-card')[0].innerHTML = error.text;
        document.getElementsByClassName('l-top-card')[0].classList.add('is-error');
        document.getElementsByClassName('l-down-card')[0].innerHTML = '';
    }

    /**
     * Слушает клик мыши по кнопке лайка на треке в плейлисте
     * @param {Object} event
     */
    likeClicked(event) {
        if (event.target.src.indexOf('/static/img/favorite_border.svg') !== -1) {
            event.target.src = '/static/img/favorite.svg';
        } else {
            event.target.src = '/static/img/favorite_border.svg';
        }
    }
}
