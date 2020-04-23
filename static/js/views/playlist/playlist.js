import {PLAYLIST, GLOBAL} from '@libs/constans';
import playlist from '@views/playlist/playlist.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/downTrackListComponent/trackListComponent';

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
        this.tracksAmount = 0;
        this.trackListComponent = new TrackListComponent(eventBus, PLAYLIST);
        this.eventBus.on(PLAYLIST.RENDER_PLAYLIST_DATA, this.setPlaylistData.bind(this));
        this.eventBus.on(PLAYLIST.SET_TRACKS_AMOUNT, this.setTracksAmount.bind(this));
        this.eventBus.on(PLAYLIST.ERROR, this.showErrors.bind(this));
        this.eventBus.on(PLAYLIST.RENDER_DELETED, this.renderDeleted.bind(this));
        this.eventBus.on(PLAYLIST.CHANGE_TRACK_AMOUNT, this.changeTrackAmount.bind(this));
    }

    /**
     * рендерит страницу плейлиста
     * @param {Object} root
     * @param {string} url
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
     * Вставляет необходимые данные треков, подписка на события
     * @param {number} amount
     */
    setTracksAmount(amount) {
        this.tracksAmount= amount;
        this.setEventListeners();
        if (this.tracksAmount === 0) {
            return;
        }
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Amount of tracks: ' +
            this.tracksAmount;
    }

    /**
     * Слушает события
     */
    setEventListeners() {
        document.getElementsByClassName('m-button-track-list-play')[0].addEventListener('click',
            this.playPlaylist.bind(this));
        document.getElementsByClassName('m-delete-playlist-button')[0].addEventListener('click',
            this.deletePlaylist.bind(this));
    }

    /**
     * Удаление плейлиста плейлиста
     */
    deletePlaylist() {
        this.eventBus.emit(PLAYLIST.DELETE_PLAYLIST, this.playlistData.id);
    }

    /**
     * Отрисовка удаления
     */
    renderDeleted() { // TODO Отрисовка удаленного плейлиста
        // console.log(this.playlistData);
    }

    /**
     * Проигрование плейлиста
     */
    playPlaylist() {
        if (this.tracksAmount === 0) {
            return;
        }
        this.globalEventBus.emit(GLOBAL.PLAY_PLAYLIST, this.playlistData.id);
    }

    /**
     * Изменение количества треков
     * @param {number} dif
     */
    changeTrackAmount(dif) {
        this.tracksAmount += dif;
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Amount of tracks: ' +
            this.tracksAmount;
    }

    /**
     * Выводит ошибку
     * @param {Object} error
     */
    showErrors(error) {
        document.getElementsByClassName('l-top-card')[0].innerHTML = error.text;
        document.getElementsByClassName('l-top-card')[0].classList.add('is-error');
        document.getElementsByClassName('l-down-card')[0].classList.add('is-hidden');
    }
}
