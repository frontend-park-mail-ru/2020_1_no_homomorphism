import {PLAYLIST, GLOBAL} from '@libs/constants';
import playlist from '@views/playlist/playlist.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/track_list/track_list';
import {globalEventBus} from '@libs/eventBus';
import User from "@libs/user";

/**
 *  вью для входа
 */
export default class PlaylistView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(playlist);
        this.eventBus = eventBus;
        this.playlistData = {};
        this.tracksAmount = 0;
        this.text = '';
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
        super.setData(User.exists());
        super.render(root);
        this.eventBus.emit(PLAYLIST.GET_PLAYLIST_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные плейлиста
     * @param {Object} playlist
     */
    setPlaylistData(playlist) {
        console.log(User.exists());
        this.playlistData = playlist;
        this.playlistData.private = true; // TODO временное решение
        this.renderPlaylist();
    }

    /**
     * Выводит данные плейлиста
     */
    renderPlaylist() {
        document.getElementsByClassName('m-big-name')[0].innerHTML = this.playlistData.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.playlistData.image;
        document.getElementById('checkbox').checked = this.playlistData.private;
    }

    /**
     * Вставляет необходимые данные треков, подписка на события
     * @param {number} amount
     */
    setTracksAmount(amount) {
        this.tracksAmount = amount;
        this.setEventListeners();
        if (this.tracksAmount === 0) {
            return;
        }
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Tracks: ' +
            this.tracksAmount;
    }

    /**
     * Слушает события
     */
    setEventListeners() {
        document.getElementsByClassName('l-button-middle-play')[0].addEventListener('click',
            this.playPlaylist.bind(this));
        document.getElementsByClassName('m-delete-playlist-button')[0].addEventListener('click',
            this.deletePlaylist.bind(this));
        document.getElementsByClassName('m-slider')[0].addEventListener('click',
            this.setPrivacy.bind(this));
        document.getElementsByClassName('m-button-share')[0].addEventListener('click',
            this.copyLink.bind(this));
        document.getElementsByClassName('m-button-share')[0].addEventListener('mouseover',
            this.showShareText.bind(this));
        document.getElementsByClassName('m-button-share')[0].addEventListener('mouseout',
            this.hideShareText.bind(this));
    }

    /**
     * Set privacy
     * @param {Object} event
     */
    setPrivacy(event) {
        console.log(this.playlistData);
        this.playlistData.private = !this.playlistData.private;
        console.log(this.playlistData);
        this.eventBus.emit(PLAYLIST.CHANGE_PRIVACY, this.playlistData.id);
    }

    /**
     * Copy playlist link to share
     * @param {Object} event
     */
    copyLink(event) {
        if (!this.playlistData.private) {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    // TODO добавить попап
                })
                .catch((err) => {
                    console.log('Something went wrong', err);
                });
            return;
        }
        document.getElementsByClassName('m-button-share')[0].classList.add('is-error-border');
    }

    /**
     * Lol
     */
    showShareText() {

        this.text = 'Click to copy the link';
        if (this.playlistData.private) {
            this.text = 'Make playlist public';
        }
        setTimeout(this.shareText.bind(this), 600);
    }

    /**
     * rr
     */
    hideShareText() {
        this.text = '';
        setTimeout(this.shareText.bind(this), 200);
    }

    /**
     * Lol
     */
    shareText() {
        document.getElementsByClassName('lol')[0].innerHTML = this.text;
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
        globalEventBus.emit(GLOBAL.PLAY_PLAYLIST, this.playlistData.id);
    }

    /**
     * Изменение количества треков
     * @param {number} dif
     */
    changeTrackAmount(dif) {
        this.tracksAmount += dif;
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Tracks: ' +
            this.tracksAmount;
    }

    /**
     * Выводит ошибку
     * @param {Object} error
     */
    showErrors(error) {
        document.getElementsByClassName('l-top-card')[0].innerHTML = error.text;
        document.getElementsByClassName('l-top-card')[0].classList.add('is-error');
        document.getElementsByClassName('l-down-card')[0].classList.add('is-not-displayed');
    }
}
