import add from '@components/add_playlist/add.tmpl.xml';
import {PLAYLIST} from '@libs/constants';
/**
 * Управление плейлистом для авторизированных пользователей,
 * не являющихся владельцем данного плейлиста
 */
export default class AddPlaylistComponent {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this._playlistID = '';
    }

    /**
     * Set playlist id
     * @param {String} playlist
     */
    set playlistData(playlist) {
        this._playlistID = playlist;
    }

    /**
     * Render
     */
    render() {
        document.getElementsByClassName('l-top-card')[0].innerHTML += add();
        this._setEventListeners.bind(this)();
    }

    /**
     * Set event listener for not auth users
     */
    _setEventListeners() {
        document.getElementsByClassName('m-add-playlist-button')[0].addEventListener('click',
            this._addPlaylist.bind(this));
    }

    /**
     * Add playlist to user
     */
    _addPlaylist() {
        // console.log(this._playlistID);
        this.eventBus.emit(PLAYLIST.ADD_PLAYLIST, this._playlistID);
        // this.eventBus.emit(PLAYLIST.ADD_PLAYLIST, 34);
        // console.log(this._playlistID);
    }
}
