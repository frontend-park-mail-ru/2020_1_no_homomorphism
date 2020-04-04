import {DOM, PLAYLIST, GLOBAL, PLAYER} from '@libs/constans.js';
import playlist from '@views/playlist/playlist.tmpl.xml';
import tracks from '@views/playlist/playlist_track.tmpl.xml';
import BaseView from '@libs/base_view';

/**
 *  вью для входа
 */
export default class PlaylistView extends BaseView {
    /**
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        super(playlist);
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.data = {};
        this.eventBus.on(PLAYLIST.RENDER_DATA, this.setPlaylistData.bind(this));
        this.eventBus.on(PLAYLIST.ERROR, this.showErrors.bind(this));
    }

    /**
     * рендерит страницу плейлиста
     */
    render(root, url) {
        super.render(root);
        this.eventBus.emit(PLAYLIST.GET_PLAYLIST_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные плейлиста
     * @param {Object} playlist
     */
    setPlaylistData(playlist) {
        console.log(playlist);
        this.data = playlist;
        this.renderPlaylist();
        this.renderTracks();
    }

    /**
     * Выводит данные плейлиста
     */
    renderPlaylist() {
        document.getElementsByClassName('m-name')[0].innerHTML = this.data.playlist.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.data.playlist.image;
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
        document.getElementsByClassName('m-button-track-list-play')[0].addEventListener('click', this.playPlaylist.bind(this));
    }

    /**
     * Проигрование плейлиста
     */
    playPlaylist () {
        console.log(this.data.playlist.id);
        this.globalEventBus.emit(GLOBAL.PLAY_PLAYLIST, {index: this.data.playlist.id});
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