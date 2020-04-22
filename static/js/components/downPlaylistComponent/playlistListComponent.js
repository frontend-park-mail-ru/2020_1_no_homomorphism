import template from '@components/downPlaylistComponent/playlist.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import PlaylistComponent from '@components/playlistComponent/playlistComponent';
import newPlaylist from '@components/playlistComponent/new_playlist.tmpl.xml';

/**
 * Список плейлистов или альбомомв
 */
export default class PlaylistsComponent {
    /**
     * @param {EventBus} eventBus
     * @param {Object} command
     */
    constructor(eventBus, command) {
        this.type = '';
        this._domItem = '';
        this.eventBus = eventBus;
        this._playlistComponent = new PlaylistComponent(this.setEventListeners.bind(this));
        this.eventBus.on(command.RENDER_ALBUMS, this.drawList.bind(this));
        this.eventBus.on(command.RENDER_PLAYLISTS, this.drawList.bind(this));
    }

    /**
     * Отрисовка списка плейлистов или альбомомв
     * @param {Object} data
     */
    drawList(data) {
        this.type = data.type;
        this._domItem = data.domItem;
        const elem = document.getElementsByClassName(data.domItem)[0];
        elem.innerHTML += template(this.generateHref(data.list));
        this.setEventListeners();
    }

    /**
     * Добавляет необходимые ссылки для проигрывания
     * @param {Array} list
     * @return {Array}
     */
    generateHref(list) {
        list.type = this.type === 'playlist';
        list.href = `/${this.type}/`;
        return list;
    }

    /**
     * Set EventListeners
     */
    setEventListeners() {
        document.querySelectorAll('.m-button-track-play-playlist').forEach((button) => {
            button.onclick = (event) => this.elemClick.bind(this)(event);
        });
        document.getElementsByClassName('m-button-without-size')[1]
            .addEventListener('click', this.createPlaylistClick.bind(this));
        document.getElementsByClassName('m-small-input')[0]
            .addEventListener('keyup', (event) => {
                if (event.keyCode === 13) {
                    this.createPlaylistClick.bind(this)(event);
                }
            });
    }

    /**
     * analyze click of playlist creation
     * @param {Object} event
     */
    createPlaylistClick(event) {
        const value = document.getElementsByClassName('m-small-input')[0].value;
        if (value !== '') {
            document.getElementsByClassName('m-small-input')[0].value = '';
            this._playlistComponent
                .createPlaylist(this.updatePlaylistList.bind(this), value);
        }
    }

    /**
     * @param {Object} playlist
     */
    updatePlaylistList(playlist) {
        document.getElementsByClassName(this._domItem)[0].innerHTML += newPlaylist(playlist);
    }

    /**
     * Слушает клик по плейлисту или альбому
     * @param {Object} event
     */
    elemClick(event) {
        let current = event.target;
        while (current !== window && current !== document.body && current != null) {
            if (current.getAttribute('class') === 'l-list-card' &&
                current.getAttribute('a-id') !== null) {
                globalEventBus.emit(`global-play-${this.type}`, current.getAttribute('a-id'));
                break;
            } else {
                current = current.parentNode;
            }
        }
    }
}
