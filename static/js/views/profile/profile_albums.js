import {PROFILE } from '@libs/constans.js';
import template from '@views/profile/profile_album.tmpl.xml';
import {GLOBAL} from '@libs/constans';


/**
 * вью для альбомов профиля
 */
export default class ProfileAlbumsView {
    /**
     * конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus,globalEventBus) {
        this.globalEventBus = globalEventBus;
        eventBus.on(PROFILE.RENDER_ALBUMS, this.drawAlbums.bind(this));
        this.eventBus = eventBus;
    }

    /**
     * Нажатие
     * @param {Object} albums
     */
    drawAlbums(albums) {
        const elem = document.getElementById('profile-album-playlist-list');
        elem.className += ' l-profile-base';
        elem.innerHTML += template(albums);
        this.setEventListeners();
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.querySelectorAll('.l-list-card').forEach((playlist) => {
            playlist.onclick = (event) => this.albumClick.bind(this)(event);
        });
    }

    /**
     * Слушает клик по альбому в профиле
     * @param {Object} event
     */
    albumClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-list-card' &&
                current.getAttribute('id') !== null) {
                this.globalEventBus.emit(GLOBAL.PLAY_ALBUM, {id: current.getAttribute('id')});
                break;
            } else {
                current = current.parentNode;
            }
        }
    }
}
