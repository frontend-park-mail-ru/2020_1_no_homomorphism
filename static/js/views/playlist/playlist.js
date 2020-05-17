import {PLAYLIST, GLOBAL} from '@libs/constants';
import playlist from '@views/playlist/playlist.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/track_list/track_list';
import {globalEventBus} from '@libs/eventBus';
import User from '@libs/user';
import SharePlaylistComponent from '@components/share_playlist/share_playlist';
import AddPlaylistComponent from '@components/add_playlist/add_playlist';

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
        this.shareComponent = new SharePlaylistComponent(eventBus);
        this.addComponent = new AddPlaylistComponent(eventBus);
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
        this.playlistData.private = true; // TODO временное решение
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
        this.tracksAmount = amount;
        this.setEventListeners();
        if (this.tracksAmount === 0) {
            return;
        }
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = 'Tracks: ' +
            this.tracksAmount;
        this.checkUser.bind(this)();
    }

    /**
     * check what type of user came - owner, authed or not authed
     */
    checkUser() {
        console.log(User.getUserData());
        if (User.exists()) {
            if (User.getUserData().id === this.playlistData.user_id) { // TODO временное решение - если зашел не хозяин
                this.addComponent.playlistData = this.playlistData.id;
                this.addComponent.render();
                return;
            }
            this.shareComponent.playlistData = this.playlistData;
            this.shareComponent.render(this.playlistData.private);
        }
    }

    /**
     * Слушает события
     */
    setEventListeners() {
        document.getElementsByClassName('l-button-middle-play')[0].addEventListener('click',
            this.playPlaylist.bind(this));
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
