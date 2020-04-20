import {PLAYLIST, GLOBAL} from '@libs/constans';
import playlist from '@views/playlist/playlist.tmpl.xml';
import tracks from '@views/template/tracks.tmpl.xml';
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
        this.playlistData = {};
        this.tracksData = {};
        this.eventBus.on(PLAYLIST.RENDER_PLAYLIST_DATA, this.setPlaylistData.bind(this));
        this.eventBus.on(PLAYLIST.RENDER_TRACKS_DATA, this.setTracksData.bind(this));
        this.eventBus.on(PLAYLIST.ERROR, this.showErrors.bind(this));
    }

    /**
     * рендерит страницу плейлиста
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(root);
        this.eventBus.emit(PLAYLIST.GET_PLAYLIST_DATA, {id: url});
        this.eventBus.emit(PLAYLIST.GET_TRACKS_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные плейлиста
     * @param {Object} playlist
     */
    setPlaylistData(playlist) {
        this.playlistData = playlist;
        this.renderPlaylist();
    }

    /**
     * Выводит данные плейлиста
     */
    renderPlaylist() {
        document.getElementsByClassName('m-big-name')[0].innerHTML = this.playlistData.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.playlistData.image;
    }

    /**
     * Вставляет необходимые данные треков
     * @param {Object} tracks
     */
    setTracksData(tracks) {
        this.tracksData = tracks;
        this.renderTracks();
    }

    /**
     * Выводит данные трека
     */
    renderTracks() {
        if (this.tracksData.length === 0) {
            return;
        }
        document.getElementsByClassName('l-track-list')[0].innerHTML =
            tracks(this.tracksData);
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Amount of tracks: ' +
            this.tracksData.length;
        this.seEventListeners();
    }

    /**
     * Слушает события
     */
    seEventListeners() {
        document.querySelectorAll('.l-track-big').forEach((track) => {
            track.onclick = (event) => this.trackClick.bind(this)(event);
        });
        document.querySelectorAll('img.m-big-more-button').forEach((button) => { // TODO Обработать
        });
        document.querySelectorAll('img.m-big-like-button').forEach((button) => {
            button.onclick = (event) => this.likeClicked(event);
        });
        document.querySelectorAll('img.m-big-add-button').forEach((button) => { // TODO выбор, в какой плейлист добавить
        });
        document.getElementsByClassName('m-button-track-list-play')[0].addEventListener('click',
            this.playPlaylist.bind(this));
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
                this.globalEventBus.emit(GLOBAL.PLAY_PLAYLIST_TRACKS, this.playlistData.id,
                    current.getAttribute('a-id'));
                break;
            } else {
                current = current.parentNode;
            }
        }
    }

    /**
     * Проигрование плейлиста
     */
    playPlaylist() {
        this.globalEventBus.emit(GLOBAL.PLAY_PLAYLIST, this.playlistData.id);
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
