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
        document.addEventListener('click', this.analyzeTouch.bind(this), {once: true});
        document.getElementsByClassName('m-small-input')[0]
            .addEventListener('keyup', (event) => {
                const value = event.target.value;
                if (event.keyCode === 13 && value !== '') {
                    event.target.value = '';
                    this._playlistComponent
                        .createPlaylist(this.renderNewPlaylist.bind(this), value);
                }
            });
    }

    /**
     * Отрисовка нового плейлиста
     * @param {Object} playlist
     */
    renderNewPlaylist(playlist) {
        document.getElementsByClassName('m-small-ul')[0].innerHTML += createdPlaylist(playlist);
        this._playlists.push(playlist);
        this._curPlaylist = document.getElementsByClassName('m-small-ul')[0].lastChild;
        this.addToPlaylist(playlist.id);
    }

    /**
     * Добавление трека в плейлист
     * @param {string} playlistID
     */
    addToPlaylist(playlistID) {
        if (playlistID !== '') {
            this._trackComponent.addToPlaylist(playlistID, this.renderAddedToPlaylist.bind(this));
        }
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
     * Анализ зоны нажатия
     * @param {Object} event
     */
    analyzeTouch(event) {
        const choosePlaylist = document.getElementsByClassName('m-choose-menu')[0];
        if (choosePlaylist === undefined) {
            return;
        }
        const isClickInside = choosePlaylist.contains(event.target);
        if (isClickInside) {
            this.addToPlaylist(this.getIdByClick(event));
            this.setEventListeners();
            return;
        }
        this.close();
    }

    /**
     * Закрытие раздела
     */
    close() {
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
     * Получение id из dom-елемента по нажатию
     * @param {Object} event
     * @return {string}
     */
    getIdByClick(event) {
        let current = event.target;
        while (current != null && !current.classList.contains('m-choose-menu')) {
            if (current.classList.contains('m-small-li') &&
                current.getAttribute('p-id') !== null) {
                this._curPlaylist = current;
                if (current.getAttribute('is-include') === 'true') {
                    return '';
                }
                return current.getAttribute('p-id');
            }
            current = current.parentNode;
        }
        return '';
    }
}
