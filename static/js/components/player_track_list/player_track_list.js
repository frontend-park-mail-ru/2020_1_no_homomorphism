import {PLAYER, GLOBAL, URL, LAYOUT} from '@libs/constants';
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
        // window.addEventListener('mousemove', (event) => {
        //     const marker = document.getElementsByClassName('current-marker')[0];
        //     const bcr = marker.getBoundingClientRect();
        //     const row = document.getElementsByClassName('track-list')[0]
        //         .getElementsByClassName('row').find((row) => {
        //             return bcr.top === row.getBoundingClientRect().top;
        //         });
        //     if (!row || row.contains(event.target)) {
        //         return;
        //     }
        //     console.log(row);
        //     marker.style.top = (parseInt(marker.style.top.slice(0, marker.style.top.length -
        //         2)) + 5).toString() + 'px';
        //     marker.style.height = (parseInt(marker.style.height.slice(0,
        //         marker.style.height.length - 2)) - 10).toString() + 'px';
        // });
        document.querySelectorAll('.track-list .row').forEach((row) => {
            row.addEventListener('click', this.tracklistClick.bind(this));
            row.addEventListener('mouseenter', this.tracklistMouseEnter.bind(this));
            row.addEventListener('mouseleave', this.tracklistMouseLeave.bind(this));
        });
        document.querySelectorAll('.delete-button').forEach((button) => {
            button.addEventListener('click', this.trackDeleteButtonClick.bind(this));
        });
        if (window.matchMedia(LAYOUT.MOBILE).matches || window.matchMedia(LAYOUT.TABLET).matches) {
            document.querySelectorAll('.more-button').forEach((button) => {
                button.onclick = (event) => this.moreClicked(event);
            });
        }
    }

    /**
     * Слушает клик по треку в плейлисте
     * @param {Object} event
     */
    tracklistClick(event) {
        this.eventBus.emit(PLAYER.GET_TRACK, this.getIdByClick(event.target));
    }

    /**
     * Слушает наведение мыши на трек в плейлисте
     * @param {Object} event
     */
    tracklistMouseEnter(event) {
        const marker = document.getElementsByClassName('current-marker')[0];
        if (marker.getBoundingClientRect().top === event.target.getBoundingClientRect().top + 5) {
            marker.style.top = (parseInt(marker.style.top.slice(0, marker.style.top.length -
                2)) - 5).toString() + 'px';
            marker.style.height = (parseInt(marker.style.height.slice(0,
                marker.style.height.length - 2)) + 10).toString() + 'px';
        }
    }

    /**
     * Слушает выход мыши с трека в плейлисте
     * @param {Object} event
     */
    tracklistMouseLeave(event) {
        const marker = document.getElementsByClassName('current-marker')[0];
        if (marker.getBoundingClientRect().top === event.target.getBoundingClientRect().top) {
            marker.style.top = (parseInt(marker.style.top.slice(0, marker.style.top.length -
                2)) + 5).toString() + 'px';
            marker.style.height = (parseInt(marker.style.height.slice(0,
                marker.style.height.length - 2)) - 10).toString() + 'px';
        }
    }

    /**
     * Слушает клик мыши по кнопке удаления на треке в плейлисте
     * @param {Object} event
     */
    trackDeleteButtonClick(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
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
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!User.exists()) {
            globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
        }
    }

    /**
     * Слушает клик мыши по кнопке добавления на треке в плейлисте
     * @param {Object} event
     */
    trackAddButtonClick(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!User.exists()) {
            globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
        }
        this._choosePlaylist.trackData = {'id': this.getIdByClick(event)};
        alert('NIKITA, I havent finished it yet');
        this.getProfilePlaylists();
    }

    /**
     * Открытие нужного меню
     * @param {Object} event
     */
    moreClicked(event) {
        event.stopImmediatePropagation();
        document.getElementsByClassName('m-dropdown').forEach((dropdown) => {
            if (dropdown != event.target.parentNode.parentNode.parentNode.lastChild) {
                dropdown.classList.remove('is-expanded');
            }
        });
        const dropdown = event.target.parentNode.parentNode.parentNode.lastChild;
        const tbcr = event.target.getBoundingClientRect();
        dropdown.classList.toggle('is-expanded');
        const dbcr = dropdown.getBoundingClientRect();
        dropdown.style.right = (document.documentElement.clientWidth - tbcr.right + 10)
            .toString() + 'px';
        const tracklistSTop = document.getElementsByClassName('track-list')[0].scrollTop;
        const tracklistCTop = document.getElementsByClassName('track-list')[0]
            .getBoundingClientRect().top;
        if (tbcr.bottom + dbcr.height > document.documentElement.clientHeight) {
            dropdown.style.top = (document.documentElement.clientHeight + tracklistSTop -
                tracklistCTop - dbcr.height - 20).toString() + 'px';
        } else {
            dropdown.style.top = (tbcr.top + tracklistSTop - tracklistCTop - 10).toString() + 'px';
        }
    }

    /**
     * Получение id из dom-елемента по нажатию
     * @param {Node} target
     * @return {Node}
     */
    getIdByClick(target) {
        while (target) {
            if (target.classList.contains('border-bottom') && target.getAttribute('id') !== null) {
                return target.getAttribute('id');
            }
            target = target.parentNode;
        }
        return undefined;
    }

    /**
     * Рисует треки в плейлисте
     * @param {Object} tracks
     */
    drawTracklist(tracks) {
        if (document.getElementsByClassName('l-player')[0]) {
            document.getElementsByClassName('l-player')[0].classList.add('l-player-visible');
        } else {
            document.getElementsByClassName('l-player-footer')[0].classList.add('l-player-visible');
        }
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
        if (document.getElementsByClassName('l-player')[0]) {
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
