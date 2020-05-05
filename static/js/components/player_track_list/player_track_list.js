import {PLAYER, GLOBAL, URL} from '@libs/constants';
import template from '@components/player_track_list/player_track_list.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import User from '@libs/user';

/**
 * Компонент - список треков в плеере
 */
export default class PlayerTrackListComponent {
    /**
     * Конструткор
     * @param {Object} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    /**
     * Sets EventListeners
     */
    setEventListeners() {
        document.querySelectorAll('.track-list').forEach((row) => {
            row.addEventListener('click', this.tracklistClick.bind(this));
        });
        document.querySelectorAll('.delete-button').forEach((button) => {
            button.addEventListener('click', this.trackDeleteButtonClick.bind(this));
        });
        document.querySelectorAll('.favorite-button').forEach((button) => {
            button.addEventListener('click', this.trackFavoriteButtonClick.bind(this));
        });
        document.querySelectorAll('.add-button').forEach((button) => {
            button.addEventListener('click', this.trackAddButtonClick.bind(this));
        });
        document.getElementsByClassName('track-list')[0]
            .addEventListener('scroll', this.trackListWheel.bind(this));
    }

    /**
     * Слушает скрол для прокрутки плейлиста
     * @param {Object} event
     */
    trackListWheel(event) {
        const delta = event.deltaY;
        const trackList = document.getElementsByClassName('track-list')[0];
        event.preventDefault();
        const top = parseInt(trackList.style.top.slice(0, trackList.style.top.length - 2));
        if (delta < 0 && top < 0 ||
            delta > 0 && trackList.getBoundingClientRect().bottom >
            document.documentElement.clientHeight
        ) {
            if (delta < 0 && top - delta / 2 > 0) {
                trackList.style.top = '0';
            } else if (delta > 0 && trackList.getBoundingClientRect().bottom - delta / 2 <
                document.documentElement.clientHeight
            ) {
                const container = document.getElementsByClassName('container-audio')[0];
                trackList.style.top = (document.documentElement.clientHeight -
                    trackList.getBoundingClientRect().height -
                    container.getBoundingClientRect().bottom).toString() + 'px';
            } else {
                trackList.style.top = (top - delta / 2).toString() + 'px';
            }
        }
    }

    /**
     * Слушает клик по треку в плейлисте
     * @param {Object} event
     */
    tracklistClick(event) {
        let current = event.target;
        if (current.classList.contains('m-obscure-title') ||
            current.classList.contains('m-big-delete-button')) {
            return;
        }
        while (current !== window && current !== document.body && current != null) { // TODO Сделать по-человечески :(
            if (current.getAttribute('class') === 'track-list' ||
                (current.getAttribute('class') !== null &&
                    current.getAttribute('class').indexOf('button') !== -1 &&
                    current.getAttribute('class').indexOf('buttons') === -1 &&
                    current.getAttribute('class').indexOf('row') !== -1)
            ) {
                break;
            }
            if (current.getAttribute('id') !== null) {
                this.eventBus.emit(PLAYER.GET_TRACK, current.getAttribute('id'));
                break;
            } else {
                current = current.parentNode;
            }
        }
    }

    /**
     * Слушает клик мыши по кнопке удаления на треке в плейлисте
     * @param {Object} event
     */
    trackDeleteButtonClick(event) {
        let target = event.target;
        while (target.getAttribute('id') === null) {
            target = target.parentNode;
        }
        this.eventBus.emit(PLAYER.DELETE, target.getAttribute('id'));
    }

    /**
     * Слушает клик мыши по кнопке лайка на треке в плейлисте
     * @param {Object} event
     */
    trackFavoriteButtonClick(event) {
        if (!User.exists()) {
            globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
        }
        alert('This functionality is not accessible by now');
    }

    /**
     * Слушает клик мыши по кнопке добавления на треке в плейлисте
     * @param {Object} event
     */
    trackAddButtonClick(event) {
        if (!User.exists()) {
            globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
        }
        this._choosePlaylist.trackData = this.getIdByClick(event);
        alert('NIKITA, I havent finished it yet');
        this.getProfilePlaylists();
    }

    /**
     * Получение id из dom-елемента по нажатию
     * @param {Object} event
     * @return {Object}
     */
    getIdByClick(event) {
        let current = event.target;
        while (current !== null && !current.classList.contains('track-list')) {
            if (current.classList.contains('border-bottom') &&
                current.getAttribute('id') !== null) {
                return {'id': current.getAttribute('id')};
            }
            current = current.parentNode;
        }
        return '';
    }

    /**
     * Рисует треки в плейлисте
     * @param {Object} tracks
     */
    drawTracklist(tracks) {
        document.getElementsByClassName('l-player')[0].classList.add('l-player-visible');
        this.eventBus.emit(PLAYER.TRACK_UPDATE, tracks[0]);
        document.getElementsByClassName('track-list')[0].innerHTML += template(tracks);
        this.locked = false;
        if (!this.expanded) {
            this.triggerClick();
        }
    }

    /**
     * Удаляет трек из списка воспроизвдения
     * @param {string} id
     */
    removeFromTracklist(id) {
        document.getElementById(id).remove();
        if (document.getElementsByClassName('track-list')[0].children.length === 1) {
            if (this.expanded) {
                this.triggerClick();
            }
            this.locked = true;
            if (document.getElementsByClassName('l-player')) {
                document.getElementsByClassName('l-player')[0].classList
                    .remove('l-player-visible');
            } else {
                document.getElementsByClassName('l-player-footer')[0].classList
                    .remove('l-player-visible');
            }
        }
    }

    /**
     * Очищает список воспроизвдения
     */
    removeFromTracklistAll() {
        if (document.getElementsByClassName('l-player')) {
            document.getElementsByClassName('l-player')[0].classList
                .remove('l-player-visible');
        } else {
            document.getElementsByClassName('l-player-footer')[0].classList
                .remove('l-player-visible');
        }
        while (document.getElementsByClassName('track-list')[0].children.length > 1) {
            document.getElementsByClassName('track-list')[0].children[document
                .getElementsByClassName('track-list')[0].children.length - 1].remove();
        }
        if (this.expanded) {
            this.triggerClick();
        }
    }
}
