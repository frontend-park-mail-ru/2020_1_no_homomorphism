import {PLAYLIST, POPUP, LAYOUT} from '@libs/constants';
import more from '@components/more_playlist/more.tmpl.xml';
import PopUp from '@components/pop-up/pop-up';

/**
 * Компонента, отвечающая за возможности авторизированного пользователя
 * управлять некоторыми функциям своего плейлиста
 */
export default class MorePlaylistComponent {
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
        if (window.matchMedia(LAYOUT.MOBILE).matches || window.matchMedia(LAYOUT.TABLET).matches) {
            document.getElementsByClassName('l-top-card')[0].innerHTML += more({mobile: true});
        } else {
            document.getElementsByClassName('l-top-card')[0].innerHTML += more({mobile: false});
            // eslint-disable-next-line no-undef
            const elem = VK.Share.button(false, {
                url: window.location.href,
                type: 'round_nocount',
                text: 'Поделиться',
            });
            document.getElementById('vk-share').innerHTML += elem;
            document.querySelectorAll('td').forEach((elem) => {
                elem.children[0].target = '_blank';
            });
        }
        document.getElementById('checkbox').checked = isPrivate;
        this._button = document.getElementById('playlist-share-button');
        if (isPrivate) {
            this._button.classList.add('is-button-disabled');
        }
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
        if (window.matchMedia(LAYOUT.MOBILE).matches || window.matchMedia(LAYOUT.TABLET).matches) {
            document.getElementsByClassName('m-more-button')[0]
                .addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                    document.getElementsByClassName('m-dropdown').forEach((dropdown) => {
                        if (dropdown != event.target.nextElementSibling) {
                            dropdown.classList.remove('is-expanded');
                        }
                    });
                    document.getElementsByClassName('m-dropdown')[0].classList
                        .toggle('is-expanded');
                });
        } else {
            document.getElementsByClassName('m-button-share')[0]
                .addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                    document.getElementsByClassName('m-dropdown')[0].classList
                        .toggle('is-expanded');
                });
        }
        document.getElementById('playlist-delete-button').addEventListener('click',
            this._deletePlaylist.bind(this));
        document.getElementsByClassName('m-slider')[0].addEventListener('click',
            this._setPrivacy.bind(this));
        this._button.addEventListener('click', this._copyLink.bind(this));
    }

    /**
     * Set privacy
     * @param {Object} event
     */
    _setPrivacy(event) {
        this._playlist.private = !this._playlist.private;
        this._button.classList.toggle('is-button-disabled');
        new PopUp(this._playlist.private ?
            POPUP.PLAYLIST_PRIVACY_PRIVATE_MESSAGE :
            POPUP.PLAYLIST_PRIVACY_PUBLIC_MESSAGE);
        this.eventBus.emit(PLAYLIST.CHANGE_PRIVACY, this._playlist.id);
    }

    /**
     * Copy playlist link to share
     * @param {Object} event
     */
    _copyLink(event) {
        if (!this._playlist.private) {
            if (navigator.share) {
                navigator.share({
                    title: 'Shared a playlist',
                    text: this._playlist.name,
                    url: window.location.href,
                })
                    .then(() => {
                        this._button.classList.add('success-border');
                        setTimeout(this.delSuccessClass.bind(this), 1000);
                        new PopUp(POPUP.PLAYLIST_LINK_COPY_MESSAGE);
                    })
                    .catch((err) => {
                        new PopUp(POPUP.PLAYLIST_LINK_COPY_ERROR_MESSAGE, true);
                    });
            } else {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                        this._button.classList.add('success-border');
                        setTimeout(this.delSuccessClass.bind(this), 1000);
                        new PopUp(POPUP.PLAYLIST_LINK_COPY_MESSAGE);
                    })
                    .catch((err) => {
                        new PopUp(POPUP.PLAYLIST_LINK_COPY_ERROR_MESSAGE, true);
                    });
            }
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
     * Удаление плейлиста плейлиста
     */
    _deletePlaylist() {
        this.eventBus.emit(PLAYLIST.DELETE_PLAYLIST, this._playlist.id);
    }
}
