import {PLAYLIST, GLOBAL, POPUP} from '@libs/constants';
import playlist from '@views/playlist/playlist.tmpl.xml';
import BaseView from '@libs/base_view';
import TrackListComponent from '@components/track_list/track_list';
import PopUp from '@components/pop-up/pop-up';
import {globalEventBus} from '@libs/eventBus';
import User from '@libs/user';
import MorePlaylistComponent from '@components/more_playlist/more_playlist';
import AddPlaylistComponent from '@components/add_playlist/add_playlist';
import {inputSanitize} from '@libs/input_sanitize';

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
        this.edit = false;
        this.moreComponent = new MorePlaylistComponent(eventBus);
        this.addComponent = new AddPlaylistComponent(eventBus);
        this.trackListComponent = new TrackListComponent(eventBus, PLAYLIST);
        this.eventBus.on(PLAYLIST.RENDER_PLAYLIST_DATA, this.setPlaylistData.bind(this));
        this.eventBus.on(PLAYLIST.RENDER_EDIT, this.renderEdit.bind(this));
        this.eventBus.on(PLAYLIST.SET_TRACKS_AMOUNT, this.setTracksAmount.bind(this));
        this.eventBus.on(PLAYLIST.ERROR, this.showErrors.bind(this));
        this.eventBus.on(PLAYLIST.RENDER_DELETED, this.renderDeleted.bind(this));
        this.eventBus.on(PLAYLIST.CHANGE_TRACK_AMOUNT, this.changeTrackAmount.bind(this));
        this.eventBus.on(PLAYLIST.RENDER_NAME, this.renderName.bind(this));
        this.eventBus.on(PLAYLIST.RENDER_IMAGE, this.renderImage.bind(this));
        this.eventBus.on(PLAYLIST.INVALID, this.showErrors.bind(this));
        this.eventBus.on(POPUP.NEW, (message, error = false) => {
            new PopUp(message, error);
        });
        this.inputChangeBinded = this.inputChange.bind(this);
        this.imgeChangeBinded = this.imageChange.bind(this);
    }

    /**
     * рендерит страницу плейлиста
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        globalEventBus.emit(GLOBAL.COLLAPSE_IF_MOBILE);
        super.render(root);
        this.eventBus.emit(PLAYLIST.GET_PLAYLIST_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные плейлиста
     * @param {Object} playlist
     */
    setPlaylistData(playlist) {
        this.playlistData = playlist;
        if (this.playlistData.private === undefined) {
            this.playlistData.private = false;
        }
        this.renderPlaylist();
    }

    /**
     * Выводит данные плейлиста
     */
    renderPlaylist() {
        document.getElementsByClassName('m-big-name')[0].innerText =
            inputSanitize(this.playlistData.name);
        document.getElementsByClassName('m-rounded-image')[0].src = this.playlistData.image;
        document.getElementsByClassName('m-rounded-image')[1].src = this.playlistData.image;
        if (this.edit) {
            this.renderEdit();
        }
    }

    /**
     * Рендерит редактирование плейлиста и обратно
     */
    renderEdit() {
        this.edit = !this.edit;
        if (!this.edit) {
            this.unsetDynamicEventListeners();
        }
        document.getElementsByClassName('m-big-name')[1].classList.toggle('is-not-displayed');
        document.getElementsByClassName('m-big-name')[1].value =
            document.getElementsByClassName('m-big-name')[0].innerText;
        document.getElementsByClassName('m-big-name')[1].size =
            document.getElementsByClassName('m-big-name')[0].innerText.length;
        document.getElementsByClassName('m-big-name')[0].classList.toggle('is-not-displayed');
        document.getElementsByClassName('l-round-image')[0].firstChild.classList
            .toggle('is-not-displayed');
        document.getElementsByClassName('l-round-image')[0].lastChild.classList
            .toggle('is-not-displayed');
        if (this.edit) {
            this.setDynamicEventListeners();
        }
    }

    /**
     * Вставляет необходимые данные треков, подписка на события
     * @param {number} amount
     */
    setTracksAmount(amount) {
        this.tracksAmount = amount;
        this.checkUser.bind(this)();
        if (this.tracksAmount === 0) {
            return;
        }
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = this.tracksAmount +
            (this.tracksAmount !== 1 ? ' tracks' : ' track');
        this.setEventListeners();
    }

    /**
     * check what type of user came - owner, authed or not authed
     */
    checkUser() {
        if (User.exists()) {
            if (User.getUserData().id !== this.playlistData.user_id) {
                this.addComponent.playlistData = this.playlistData.id;
                this.addComponent.render();
                return;
            }
            this.moreComponent.playlistData = this.playlistData;
            this.moreComponent.render(this.playlistData.private);
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
     * Set dynamic EventListeners
     */
    setDynamicEventListeners() {
        document.getElementsByClassName('m-big-name')[1]
            .addEventListener('change', this.inputChangeBinded);
        document.getElementById('image-upload')
            .addEventListener('change', this.imgeChangeBinded);
    }

    /**
     * Unset dynamic EventListeners
     */
    unsetDynamicEventListeners() {
        document.getElementsByClassName('m-big-name')[1]
            .removeEventListener('change', this.inputChangeBinded);
        document.getElementById('image-upload')
            .removeEventListener('change', this.imgeChangeBinded);
    }

    /**
     * Слушает изменение названия плейлиста
     * @param {Object} event
     */
    inputChange(event) {
        if (event.target.value === '') {
            new PopUp(POPUP.PLAYLIST_EMPTY_NAME_ERROR, true);
        }
        this.eventBus.emit(PLAYLIST.CHANGE_NAME, this.playlistData.id, event.target.value);
    }

    /**
     * Рендерит новое название
     * @param {String} name
     */
    renderName(name) {
        this.playlistData.name = name;
        this.renderPlaylist();
    }

    /**
     * Слушает изменение картинки плейлиста
     * @param {Object} event
     */
    imageChange(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.eventBus.emit(PLAYLIST.CHANGE_IMAGE, this.playlistData.id);
    }

    /**
     * Рендерит новую картинку
     * @param {String} image
     */
    renderImage(image) {
        this.playlistData.image = image;
        this.renderPlaylist();
    }

    /**
     * показывает ошибку загрузки картинки
     * @param {Object} errors
     */
    showImageErrors(errors) {
        this.errors = errors;
        for (const key in errors) {
            if (!{}.hasOwnProperty.call(errors, key)) {
                continue;
            }
            const message = document.getElementById(key);
            message.innerText = errors[key];
            message.style.height = '15px';
            message.style.marginBottom = '10px';
            message.style.visibility = 'visible';
        }
    }

    /**
     * не показывает ошибку загрузки картинки
     */
    hideErrors() {
        for (const key in this.errors) {
            if (!{}.hasOwnProperty.call(this.errors, key)) {
                continue;
            }
            const message = document.getElementById(key);
            message.innerText = '';
            message.style.height = '0';
            message.style.marginBottom = '0';
            message.style.visibility = 'hidden';
        }
    }

    /**
     * Отрисовка удаления
     */
    renderDeleted() { // TODO Отрисовка удаленного плейлиста
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
        document.getElementsByClassName('m-tracks-amount')[0].innerHTML = this.tracksAmount +
            (this.tracksAmount !== 1 ? ' tracks' : ' track');
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
