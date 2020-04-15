import template from '@components/downPlaylistComponent/playlist.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';

/**
 * Список плейлистов или альбомомв
 */
export default class PlaylistsComponent {
    /**
     * @param {EventBus} eventBus
     * @param {string} command
     */
    constructor(eventBus, command) {
        this.type = '';
        this.eventBus = eventBus;
        this.eventBus.on(command, this.drawList.bind(this));
    }

    /**
     * Отрисовка списка плейлистов или альбомомв
     * @param {Array} list
     * @param {string} domItem
     * @param {string} type
     */
    drawList(list, domItem, type) {
        const elem = document.getElementsByClassName(domItem)[0];
        this.type = type;
        elem.className += ' l-profile-base';
        elem.innerHTML += template(this.generateHref(list));
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
