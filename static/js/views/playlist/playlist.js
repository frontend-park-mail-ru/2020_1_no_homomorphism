import {TEMPLATES, DOM, PLAYLIST} from '@libs/constans.js';
import playlist from '@views/playlist/playlist.tmpl.xml';
import tracks from '@views/playlist/playlist_track.tmpl.xml';
import BaseView from '@libs/base_view';

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
        this.data = {};
        this.userData = {};
        this.eventBus.on(PLAYLIST.RENDER_DATA, this.setPlaylistData.bind(this));
        this.eventBus.on(PLAYLIST.RENDER_USER_DATA, this.setUserData.bind(this));
    }

    /**
     * рендерит страницу плейлиста
     */
    render(root, url) {
        super.render(root);
        this.eventBus.emit(PLAYLIST.GET_PLAYLIST_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные плейлиста
     * @param {Object} playlist
     */
    setPlaylistData(playlist) {
        this.data = playlist;
        this.renderPlaylist();
        this.renderTracks();
    }

    renderPlaylist() {
        document.getElementsByClassName('m-name')[0].innerHTML = this.data.playlist.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.data.playlist.image;
        // document.getElementsByClassName('m-list-image')[0].src = this.data.playlist.image;
    }

    renderTracks() { // TODO обработать пустой плейлист
        document.getElementsByClassName('l-track-list')[0].innerHTML = tracks(this.data.tracks);
    }

    /**
     * Вставляет необходимые данные пользователя
     * @param {Object} user
     */
    setUserData(user) {
        this.userData = user;
        this.renderUser();
    }

    renderUser() {
        console.log(this.userData);
    }
}