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
            share(isPrivate);
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
        document.getElementsByClassName('m-button-share')[0].addEventListener('click',
            this._copyLink.bind(this));
        document.getElementsByClassName('m-button-share')[0].addEventListener('mouseover',
            this._showShareText.bind(this));
        document.getElementsByClassName('m-button-share')[0].addEventListener('mouseout',
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
