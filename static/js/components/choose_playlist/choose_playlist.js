import dropdown from '@components/choose_playlist/choose_playlist.tmpl.xml';
import createdPlaylist from '@components/choose_playlist/created_playlist.tmpl.xml';
import {DOM, SEARCH, POPUP} from '@libs/constants';
import TrackComponent from '@components/track/track';
import PlaylistComponent from '@components/playlist/playlist';
import PopUp from '@components/pop-up/pop-up';

/**
 * Компонент - выпадающее меню при добавлении трека в плейлист
 */
export default class ChoosePlaylist {
    /**
     * Конструткор
     * @param {EventBus} eventBus
     * @param {object} modelType
     */
    constructor(eventBus, modelType) {
        this.eventBus = eventBus;
        this._trackComponent = new TrackComponent();
        this._playlistComponent = new PlaylistComponent(this.setEventListeners.bind(this));
        this._trackData = {};
        this._playlists = [];
        this._callbackEventListener = {};
        this.analyzeTouchBinded = this.analyzeTouch.bind(this);
        this.windowKeyupBinded = this.windowKeyup.bind(this);
        this.inputKeyupBinded = this.inputKeyup.bind(this);
        this.submitButtonClickBinded = this.submitButtonClick.bind(this);
        this.closeBinded = this.close.bind(this);
    }

    /**
     * Установка текущего айди трека
     * @param {Object} trackData
     */
    set trackData(trackData) {
        this._trackData = trackData;
        this._trackComponent.trackData = trackData;
    }

    /**
     * Подготовка к рендерингу
     * @param {function} callbackEventListener
     * @param {Array} playlists
     */
    render(callbackEventListener, playlists) {
        this._playlists = playlists;
        this._callbackEventListener = callbackEventListener;
        this._trackComponent
            .getTrackPlaylists(this._trackData.id, this.setTrackPlaylists.bind(this));
    }

    /**
     * Непосредственный рендеринг
     * @param {Array} playlistIncludes
     */
    setTrackPlaylists(playlistIncludes) {
        for (const elem of this._playlists) {
            elem.include = playlistIncludes.includes(elem.id);
        }
        document.getElementsByClassName(DOM.TOP_CONTENT)[0].innerHTML += dropdown(this._playlists);
        document.getElementsByClassName(DOM.CONTENT)[0]
            .firstChild
            .classList
            .add('is-un-emphasized');
        document.getElementsByClassName(DOM.NAVBAR)[0]
            .classList
            .add('is-untouchable');
        this.setEventListeners();
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.addEventListener('click', this.analyzeTouchBinded);
        window.addEventListener('keyup', this.windowKeyupBinded);
        document.getElementsByClassName('m-small-input')[0]
            .addEventListener('keyup', this.inputKeyupBinded);
        document.getElementsByClassName('submit-input-button')[0]
            .addEventListener('click', this.submitButtonClickBinded);
        document.getElementsByClassName('m-close-choose-menu-button')[0]
            .addEventListener('click', this.closeBinded);
    }

    /**
     * Unset EventListeners
     */
    unsetEventListeners() {
        document.removeEventListener('click', this.analyzeTouchBinded);
        window.removeEventListener('keyup', this.windowKeyupBinded);
        document.getElementsByClassName('m-small-input')[0]
            .removeEventListener('keyup', this.inputKeyupBinded);
        document.getElementsByClassName('submit-input-button')[0]
            .removeEventListener('click', this.submitButtonClickBinded);
        document.getElementsByClassName('m-close-choose-menu-button')[0]
            .removeEventListener('click', this.closeBinded);
    }

    /**
     * Слушает keyup
     * @param {Object} event
     */
    windowKeyup(event) {
        if (event.keyCode === 27) {
            this.close();
        }
    }

    /**
     * Слушает keyup
     * @param {Object} event
     */
    inputKeyup(event) {
        const value = event.target.value;
        if (event.keyCode !== 13) {
            return;
        }
        if (value !== '') {
            event.target.value = '';
            this.unsetEventListeners();
            this._playlistComponent
                .createPlaylist(this.renderNewPlaylist.bind(this), value);
        } else {
            new PopUp(POPUP.PLAYLIST_EMPTY_NAME_ERROR, true);
        }
    }

    /**
     * Слушает клик по кнопке в инпуте
     * @param {Object} event
     */
    submitButtonClick(event) {
        const value = event.target.parentNode.parentNode.firstChild.value;
        if (value !== '') {
            event.target.parentNode.classList.add('is-pressed');
            setTimeout(() => {
                event.target.parentNode.classList.remove('is-pressed');
            }, 100);
            event.target.parentNode.parentNode.firstChild.value = '';
            this.unsetEventListeners();
            this._playlistComponent
                .createPlaylist(this.renderNewPlaylist.bind(this), value);
        } else {
            new PopUp(POPUP.PLAYLIST_EMPTY_NAME_ERROR, true);
        }
    }

    /**
     * Отрисовка нового плейлиста
     * @param {Object} playlist
     */
    renderNewPlaylist(playlist) {
        document.getElementsByClassName('m-small-ul')[0].innerHTML += createdPlaylist(playlist);
        this._playlists.push(playlist);
        this._curPlaylist = document.getElementsByClassName('m-small-ul')[0].lastChild;
        this._trackComponent.addToPlaylist(playlist.id, this.renderAddedToPlaylist.bind(this));
    }

    /**
     * Трек добавлен в плейлист
     * @param {string} playlistID
     */
    renderAddedToPlaylist(playlistID) {
        this._curPlaylist.firstChild.classList.remove('m-small-add-button');
        this._curPlaylist.firstChild.classList.add('m-small-ticked-button');
        this._curPlaylist.setAttribute('is-include', 'true');
        const playlist = this._playlists.find((item) => item.id === playlistID);
        playlist.include = true;
        new PopUp(POPUP.TRACK_ADDITION_MESSAGE + playlist.name);
    }

    /**
     * Трек удалён в плейлиста
     * @param {string} playlistID
     */
    renderDeletedFromPlaylist(playlistID) {
        this._curPlaylist.firstChild.classList.add('m-small-add-button');
        this._curPlaylist.firstChild.classList.remove('m-small-ticked-button');
        this._curPlaylist.setAttribute('is-include', 'false');
        const playlist = this._playlists.find((item) => item.id === playlistID);
        playlist.include = false;
        new PopUp(POPUP.TRACK_DELETION_MESSAGE + playlist.name);
    }

    /**
     * Анализ зоны нажатия
     * @param {Object} event
     */
    analyzeTouch(event) {
        const bcr = document.getElementsByClassName('l-pop-up-container')[0]
            .getBoundingClientRect();
        let children = document.getElementsByClassName('l-pop-up-container')[0].children.length;
        children = children > 3 ? 3 : children;
        const containerY = bcr.top + (bcr.height * (1 - children / 3));
        const isPopUpClicked = event.clientX > bcr.left && event.clientX < bcr.right &&
            event.clientY > containerY &&
            event.clientY < bcr.bottom;
        if (isPopUpClicked) {
            return;
        }
        const isClickInside = document.getElementsByClassName('m-choose-menu')[0]
            .contains(event.target);
        if (isClickInside) {
            const info = this.getInfoByClick(event);
            if (info.playlistId !== '') {
                if (info.action === 'add') {
                    this._trackComponent.addToPlaylist(info.playlistId,
                        this.renderAddedToPlaylist.bind(this));
                } else if (info.action === 'remove') {
                    this._trackComponent.delFromPlaylist(info.playlistId,
                        this.renderDeletedFromPlaylist.bind(this));
                }
            }
            this.unsetEventListeners();
            this.setEventListeners();
            return;
        }
        this.close();
    }

    /**
     * Закрытие раздела
     */
    close() {
        this.unsetEventListeners();
        document
            .getElementsByClassName(DOM.TOP_CONTENT)[0]
            .removeChild(
                document.getElementsByClassName(DOM.TOP_CONTENT)[0].lastChild);
        document
            .getElementsByClassName(DOM.CONTENT)[0]
            .firstChild
            .classList
            .remove('is-un-emphasized');
        document.getElementsByClassName(DOM.NAVBAR)[0]
            .classList
            .remove('is-untouchable');
        this.eventBus.emit(SEARCH.SET_LISTENERS);
        this._callbackEventListener();
    }


    /**
     * Получение информации из dom-елемента по нажатию
     * @param {Object} event
     * @return {Object}
     */
    getInfoByClick(event) {
        let current = event.target;
        while (current != null && !current.classList.contains('m-choose-menu')) {
            if (current.classList.contains('m-small-li') &&
                current.getAttribute('p-id') !== null) {
                this._curPlaylist = current;
                if (current.getAttribute('is-include') === 'true') {
                    return {action: 'remove', playlistId: current.getAttribute('p-id')};
                }
                return {action: 'add', playlistId: current.getAttribute('p-id')};
            }
            current = current.parentNode;
        }
        return {action: 'add', playlistId: ''};
    }
}
