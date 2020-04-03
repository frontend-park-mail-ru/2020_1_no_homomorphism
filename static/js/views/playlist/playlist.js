import {TEMPLATES, DOM, PLAYLIST} from '@libs/constans.js';
import playlist from '@views/playlist/playlist.tmpl.xml'
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
        this.playlist = {};
        this.eventBus.on(PLAYLIST.RENDER_DATA, this.setData.bind(this));
    }
    /**
     * рендерит страницу плейлиста
     */
    render(root, url) {
        super.render(root);
        this.eventBus.emit(PLAYLIST.GET_DATA, {id: url});
    }

    /**
     * Вставляет необходимые данные
     * @param {Object} playlist
     */
    setData(playlist) {
        console.log(playlist);
        this.playlist = playlist;
        this.setPlaylistData();
        this.setTracks();
    }

    setPlaylistData() {
        // console.log(this.playlist.playlist);
        document.getElementsByClassName('m-name')[0].innerHTML = this.playlist.playlist.name;
        document.getElementsByClassName('m-rounded-image')[0].src = this.playlist.playlist.image;
    }

    setTracks() {
        if (this.playlist.tracks.length) {
            console.log(this.playlist.tracks.length);
        }
        console.log(this.playlist.tracks);
        document.getElementsByClassName('l-track-list')[0].innerHTML = tracks(this.playlist.tracks);
    }
}