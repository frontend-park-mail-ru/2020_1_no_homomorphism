import dropdown from '@components/choosePlaylistComponent/choose_playlist.tmpl.xml';
import {DOM} from '@libs/constans';
import TrackComponent from '@components/trackComponent/trackComponent';
import PlaylistComponent from '@components/playlistComponent/playlistComponent';

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
        this._modelType = modelType;
        this._trackComponent = new TrackComponent();
        this._playlistComponent = new PlaylistComponent();
        this._trackData = {};
        this._playlists = [];
        this._playlistIncludes = [];
    }

    /**
     * Установка текущего айди трека
     * @param {string} trackData
     */
    set trackData(trackData) {
        this._trackData = trackData;
        this._trackComponent.trackData = trackData;
    }

    /**
     * Конструткор
     * @param {function} callbackEventListener
     * @param {Array} playlists
     */
    render(callbackEventListener, playlists) {
        this._playlists = playlists;
        this.callbackEventListener = callbackEventListener;
        this._trackComponent
            .getTrackPlaylists(this._trackData.id, this.setTrackPlaylists.bind(this));
        // console.log(this._playlists);
    }

    /**
     * Определение, в каких плейлистах есть трек
     * @param {Array} playlistIncludes
     */
    setTrackPlaylists(playlistIncludes) {
        // console.log(playlistIncludes);
        for (const elem of this._playlists) {
            // playlistIncludes.forEach((elem) => );
            elem.include = playlistIncludes.includes(elem.id);
            // elem.notInclude = !elem.include;
            // elem.include = false;
        }
        document.getElementsByClassName(DOM.CONTENT)[0].innerHTML += dropdown(this._playlists);
        document.getElementsByClassName(DOM.CONTENT)[0]
            .firstChild
            .classList
            .add('is-un-emphasized');
        this.setEventListeners();
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.addEventListener('click', this.closeMenu.bind(this), {once: true});
        document.getElementsByClassName('m-small-input')[0]
            .addEventListener('keyup', (event) => {
                if (event.keyCode === 13) {
                    this._playlistComponent.createPlaylist(event.target.value);
                }
                // this.setEventListeners.bind(this)();
            });
    }

    /**
     * Закрытие меню
     * @param {Object} event
     */
    closeMenu(event) {
        const choosePlaylist = document.getElementsByClassName('m-choose-menu')[0];
        const isClickInside = choosePlaylist.contains(event.target);

        if (!isClickInside) {
            document.getElementsByClassName(DOM.CONTENT)[0]
                .removeChild(document.getElementsByClassName(DOM.CONTENT)[0].lastChild);
            document.getElementsByClassName(DOM.CONTENT)[0]
                .firstChild
                .classList
                .remove('is-un-emphasized');
            this.callbackEventListener();
        } else {
            this.addToPlaylist(this.getIdByClick(event));
            this.setEventListeners.bind(this)();
        }
    }

    /**
     * Добавление трека в плейлист
     * @param {string} playlistID
     */
    addToPlaylist(playlistID) {
        if (playlistID !== '') {
            this._trackComponent.addToPlaylist(playlistID, this.addedToPlaylist.bind(this));
        }
    }

    /**
     * Трек добавлен в плейлист
     * @param {string} playlistID
     */
    addedToPlaylist(playlistID) {
        this._curPlaylist.firstChild.classList.remove('m-small-add-button');
        this._curPlaylist.firstChild.classList.add('m-small-ticked-button');
        const playlist = this._playlists.find((item) => item.id === playlistID);
        playlist.include = true;
    }


    /**
     * Получение id из dom-елемента по нажатию
     * @param {Object} event
     * @return {string}
     */
    getIdByClick(event) {
        let current = event.target;
        while (current != null) {
            if (current.getAttribute('class') === 'm-small-li' &&
                current.getAttribute('p-id') !== null) {
                this._curPlaylist = current;
                if (this._playlistIncludes.includes(current.getAttribute('p-id'))) {
                    return '';
                }
                return current.getAttribute('p-id');
            }
            current = current.parentNode;
        }
    }
}
