import {ALBUM, GLOBAL, PLAYER} from '@libs/constans.js';
import playlist from '@views/album/album.tmpl.xml';
import tracks from '@views/album/album_track.tmpl.xml';
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
        this.data = {};
        this.eventBus.on(ALBUM.RENDER_DATA, this.setAlbumData.bind(this));
        this.eventBus.on(ALBUM.ERROR, this.showErrors.bind(this));
    }

    /**
     * рендерит страницу плейлиста
     */
    render(root, url) {
        super.render(root);
        this.eventBus.emit(ALBUM.GET_ALBUM_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные альбома
     * @param {Object} album
     */
    setAlbumData(album) {
        this.data = album;
        this.renderAlbum();
        this.renderTracks();
    }

    /**
     * Выводит данные альбома
     */
    renderAlbum() {
        document.getElementsByClassName('m-name')[0].innerHTML = this.data.album.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.data.album.image;
    }

    /**
     * Выводит данные трека
     */
    renderTracks() {
        if (this.data.tracks.length === 0) {
            return;
        }
        document.getElementsByClassName('l-track-list')[0].innerHTML = tracks(this.data.tracks);
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Amount of tracks: ' + this.data.tracks.length;
        document.getElementsByClassName('l-track-list')[0].className += ' l-profile-base';
        this.seEventListeners();
    }

    /**
     * Слушает события
     */
    seEventListeners() {
        document.querySelectorAll('.l-track-big').forEach((row) => { // TODO Никитуля, отсылочка вам
        });
        document.querySelectorAll('img.m-more-button').forEach((button) => { // TODO Обработать
        });
        document.querySelectorAll('img.m-like-button').forEach((button) => {
            button.onclick = (event) => this.likeClicked(event);
        });
        document.querySelectorAll('img.m-add-button').forEach((button) => { // TODO выбор, в какой плейлист добавить
        });
        document.getElementsByClassName('m-button-track-list-play')[0].addEventListener('click', this.playAlbum.bind(this));
    }

    /**
     * Проигрование плейлиста
     */
    playAlbum() {
        this.globalEventBus.emit(GLOBAL.PLAY_ALBUM, {id: this.data.album.id});
    }

    /**
     * Выводит ошибку
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
