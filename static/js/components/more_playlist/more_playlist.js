import {PLAYLIST, LAYOUT} from '@libs/constants';
import more from '@components/more_playlist/more.tmpl.xml';
import PopUp from '@components/pop-up/pop-up';
import {lang} from '@libs/language';

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
            document.getElementsByClassName('l-top-card')[0].innerHTML += more({
                lang: lang,
                mobile: true,
            });
        } else {
            document.getElementsByClassName('l-top-card')[0]
                .innerHTML += more({
                    lang: lang,
                    mobile: false,
                    id: this._playlist.id,
                });
            // eslint-disable-next-line no-undef
            const elem = VK.Share.button(false, {
                url: window.location.href,
                type: 'round_nocount',
                text: 'Share',
            });
            document.getElementById('vk-share').innerHTML += elem;
            document.querySelectorAll('td').forEach((elem) => {
                elem.children[0].target = '_blank';
            });
        }
        document.getElementById('checkbox').checked = isPrivate;
        this._button = document.getElementById('playlist-share-button');
        if (isPrivate) {
            document.getElementsByClassName('m-button-share')[0]
                .classList.add('is-button-disabled');
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
            document.getElementsByClassName('m-more-button')[0]
                .addEventListener('touchstart', (event) => {
                    event.preventDefault();
                    event.target.classList.add('touched');
                });
            document.getElementsByClassName('m-more-button')[0]
                .addEventListener('touchend', (event) => {
                    event.preventDefault();
                    event.target.classList.remove('touched');
                    event.target.click();
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
        document.getElementById('playlist-delete-button').addEventListener('touchend', (event) => {
            event.preventDefault();
            if (event.target.tagName == 'BUTTON') {
                event.target.classList.add('touched');
                setTimeout(() => event.target.classList.remove('touched'), 100);
            } else {
                event.target.parentNode.classList.add('touched');
                setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
            }
            event.target.click();
        });
        document.getElementById('playlist-edit-button').addEventListener('click',
            this._editPlaylist.bind(this));
        document.getElementById('playlist-edit-button').addEventListener('touchend', (event) => {
            event.preventDefault();
            if (event.target.tagName == 'BUTTON') {
                event.target.classList.add('touched');
                setTimeout(() => event.target.classList.remove('touched'), 100);
            } else {
                event.target.parentNode.classList.add('touched');
                setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
            }
            event.target.click();
        });
        document.getElementsByClassName('m-slider')[0].addEventListener('click',
            this._setPrivacy.bind(this));
        document.getElementsByClassName('m-slider')[0].addEventListener('touchend', (event) => {
            event.preventDefault();
            event.target.click();
        });
        this._button.addEventListener('click', this._copyLink.bind(this));
        this._button.addEventListener('touchend', (event) => {
            event.preventDefault();
            if (event.target.tagName == 'BUTTON') {
                event.target.classList.add('touched');
                setTimeout(() => event.target.classList.remove('touched'), 100);
            } else {
                event.target.parentNode.classList.add('touched');
                setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
            }
            event.target.click();
        });
    }

    /**
     * Set privacy
     * @param {Object} event
     */
    _setPrivacy(event) {
        this._playlist.private = !this._playlist.private;
        document.getElementsByClassName('m-button-share')[0]
            .classList.toggle('is-button-disabled');
        new PopUp(this._playlist.private ?
            lang.popUp.PLAYLIST_PRIVACY_PRIVATE_MESSAGE :
            lang.popUp.PLAYLIST_PRIVACY_PUBLIC_MESSAGE);
        this.eventBus.emit(PLAYLIST.CHANGE_PRIVACY, this._playlist.id);
    }

    /**
     * Copy playlist link to share
     * @param {Object} event
     */
    _copyLink(event) {
        if (navigator.share) {
            navigator.share({
                title: 'Shared a playlist',
                text: this._playlist.name,
                url: window.location.href,
            })
                .then(() => {
                    this._button.classList.add('success-border');
                    setTimeout(this.delSuccessClass.bind(this), 1000);
                    new PopUp(lang.popUp.PLAYLIST_LINK_COPY_MESSAGE);
                })
                .catch((err) => {
                    new PopUp(lang.popUp.PLAYLIST_LINK_COPY_ERROR_MESSAGE, true);
                });
            return;
        }
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                this._button.classList.add('success-border');
                setTimeout(this.delSuccessClass.bind(this), 1000);
                new PopUp(lang.popUp.PLAYLIST_LINK_COPY_MESSAGE);
            })
            .catch((err) => {
                new PopUp(lang.popUp.PLAYLIST_LINK_COPY_ERROR_MESSAGE, true);
            });
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

    /**
     * Изменение плейлиста
     */
    _editPlaylist() {
        this.eventBus.emit(PLAYLIST.RENDER_EDIT);
    }
}
