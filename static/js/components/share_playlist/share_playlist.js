import {PLAYLIST} from '@libs/constants';
import share from '@components/share_playlist/share.tmpl.xml';

/**
 * Компонента, отвечающая за возможности авторизированного пользователя
 * управлять некоторыми функциям своего плейлиста
 */
export default class SharePlaylistComponent {
    /**
     * Constructor
     * @param {Object} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this._playlist = {};
    }

    /**
     * Render
     * @param {String} isPrivate
     */
    render(isPrivate) {
        document.getElementsByClassName('l-top-card')[0].innerHTML +=
            share();
        document.getElementById('checkbox').checked = isPrivate;
        this._button = document.getElementsByClassName('m-button-share')[0];
        this._setOwnerEventListener();
    }

    /**
     * Set playlist data
     * @param {Object} playlist
     */
    set playlistData(playlist) {
        this._playlist = playlist;
    }

    /**
     * set owner event listeners
     */
    _setOwnerEventListener() {
        document.getElementsByClassName('m-delete-playlist-button')[0].addEventListener('click',
            this._deletePlaylist.bind(this));
        document.getElementsByClassName('m-slider')[0].addEventListener('click',
            this._setPrivacy.bind(this));
        this._button.addEventListener('click',
            this._copyLink.bind(this));
        this._button.addEventListener('mouseover',
            this._showShareText.bind(this));
        this._button.addEventListener('mouseout',
            this._hideShareText.bind(this));
    }

    /**
     * Set privacy
     * @param {Object} event
     */
    _setPrivacy(event) {
        this._playlist.private = !this._playlist.private;
        this.eventBus.emit(PLAYLIST.CHANGE_PRIVACY, this._playlist.id);
    }

    /**
     * Copy playlist link to share
     * @param {Object} event
     */
    _copyLink(event) {
        if (!this._playlist.private) {
            navigator.clipboard.writeText(window.location.href)
                .then(() => {
                    this._button.classList.add('success-border');
                    setTimeout(this.delSuccessClass.bind(this), 1000);
                })
                .catch((err) => {
                    console.log('Something went wrong', err);
                });
            return;
        }
        this._button.classList.toggle('error-border');
        setTimeout(this.delErrorClass.bind(this), 1000);
    }

    /**
     * Удаление класса
     */
    delSuccessClass() {
        this._button.classList.remove('success-border');
    }

    /**
     * Удаление класса
     */
    delErrorClass() {
        this._button.classList.remove('error-border');
    }

    /**
     * Show text
     */
    _showShareText() {
        this.text = 'Click to copy the link';
        if (this._playlist.private) {
            this.text = 'Make playlist public';
        }
        setTimeout(this._shareText.bind(this), 600);
    }

    /**
     * Hide text
     */
    _hideShareText() {
        this.text = '';
        setTimeout(this._shareText.bind(this), 200);
    }

    /**
     * Set text
     */
    _shareText() {
        document.getElementsByClassName('m-share-text')[0].innerHTML = this.text;
    }

    /**
     * Удаление плейлиста плейлиста
     */
    _deletePlaylist() {
        this.eventBus.emit(PLAYLIST.DELETE_PLAYLIST, this._playlist.id);
    }
}
