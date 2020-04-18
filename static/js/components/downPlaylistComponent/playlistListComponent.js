import template from '@components/downPlaylistComponent/playlist.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';

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
        this.eventBus = eventBus;
        this.eventBus.on(command.RENDER_ALBUMS, this.drawList.bind(this));
        this.eventBus.on(command.RENDER_PLAYLISTS, this.drawList.bind(this));
    }

    /**
     * Отрисовка списка плейлистов или альбомомв
     * @param {Object} data
     */
    drawList(data) {
        const elem = document.getElementsByClassName(data.domItem)[0];
        this.type = data.type;
        elem.innerHTML += template(this.generateHref(data.list));
        this.setEventListeners();
    }

    /**
     * Добавляет необходимые ссылки для проигрывания
     * @param {Array} list
     * @return {Array}
     */
    generateHref(list) {
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
