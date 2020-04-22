import {ALBUM, GLOBAL} from '@libs/constans';
import playlist from '@views/album/album.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/downTrackListComponent/trackListComponent';

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
        this.trackListComponent = new TrackListComponent(eventBus, ALBUM);
        this.eventBus.on(ALBUM.RENDER_ALBUM, this.setAlbumData.bind(this));
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
    }

    /**
     * Вставляет необходимые данные альбома
     * @param {Object} album
     */
    setAlbumData(album) {
        this.albumData = album;
        this.renderAlbum();
    }

    /**
     * Выводит данные альбома
     */
    renderAlbum() {
        document.getElementsByClassName('m-big-name')[0].innerHTML = this.albumData.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.albumData.image;
        this.setEventListeners();
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
     * Слушает события
     */
    setEventListeners() {
        document.getElementsByClassName('m-button-track-list-play')[0].addEventListener('click',
            this.playAlbum.bind(this));
    }

    /**
     * Проигрование плейлиста
     */
    playAlbum() {
        this.globalEventBus.emit(GLOBAL.PLAY_ALBUM, this.albumData.id);
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
