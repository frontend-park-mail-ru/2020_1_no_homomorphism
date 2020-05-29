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
        eventBus.on(PLAYER.ADD_TO_QUEUE, this.drawNew.bind(this));
    }

    /**
     * Sets EventListeners
     */
    setEventListeners() {
        document.querySelectorAll('.l-player-track').forEach((row) => {
            row.addEventListener('click', this.tracklistClick.bind(this));
            row.addEventListener('mouseenter', this.tracklistMouseEnter.bind(this));
            row.addEventListener('mouseleave', this.tracklistMouseLeave.bind(this));
            row.addEventListener('dragstart', this.dragStart.bind(this));
            row.addEventListener('dragover', this.dragOver.bind(this));
            row.addEventListener('drop', this.drop.bind(this));
            row.addEventListener('dragend', this.dragEnd.bind(this));
        });
        document.getElementsByClassName('drag-patch')[0].addEventListener('dragover', (event) => {
            event.preventDefault();
            this.eventBus.emit(PLAYER.MOVE_MARKER_TO_CURRENT);
            return false;
        });
        document.getElementsByClassName('drag-patch')[0].addEventListener('drop', (event) => {
            event.stopPropagation();
            document.getElementsByClassName('drag-patch')[0]
                .insertAdjacentElement('afterend', this.dragged);
            document.getElementsByClassName('drag-patch')[0].classList.remove('is-active');
            document.getElementsByClassName('current-marker')[0].insertAdjacentElement('afterend',
                document.getElementsByClassName('drag-patch')[0]);
            this.eventBus.emit(PLAYER.MOVE_MARKER_TO_CURRENT);
            this.eventBus.emit(PLAYER.CHANGE_ORDER, this.dragged.getAttribute('id'),
                this.dragged.previousSibling.getAttribute('id'));
        });
        document.querySelectorAll('.delete-button').forEach((button) => {
            button.addEventListener('click', this.trackDeleteButtonClick.bind(this));
        });
        if (window.matchMedia(LAYOUT.MOBILE).matches || window.matchMedia(LAYOUT.TABLET).matches) {
            document.getElementsByClassName('l-player')[0]
                .querySelectorAll('.more-button').forEach((button) => {
                    button.ontouchend = (event) => {
                        event.preventDefault();
                        event.target.classList.add('touched');
                        setTimeout(() => event.target.classList.remove('touched'), 200);
                        event.target.click();
                    };
                    button.onclick = (event) => this.moreClicked(event);
                });
            document.getElementsByClassName('l-player')[0]
                .querySelectorAll('.add-button').forEach((button) => {
                    button.ontouchend = (event) => {
                        event.preventDefault();
                        if (event.target.tagName == 'BUTTON') {
                            event.target.classList.add('touched');
                            setTimeout(() => event.target.classList.remove('touched'), 100);
                        } else {
                            event.target.parentNode.classList.add('touched');
                            setTimeout(() => event.target.parentNode.classList.remove('touched'),
                                100);
                        }
                        // event.target.click();
                    };
                    // button.onclick = (event) => this.addToPlaylist.bind(this)(event);
                });
            document.getElementsByClassName('l-player')[0]
                .querySelectorAll('.like-button').forEach((button) => {
                    button.ontouchend = (event) => {
                        event.preventDefault();
                        if (event.target.tagName == 'BUTTON') {
                            event.target.classList.add('touched');
                            setTimeout(() => event.target.classList.remove('touched'), 100);
                        } else {
                            event.target.parentNode.classList.add('touched');
                            setTimeout(() => event.target.parentNode.classList.remove('touched'),
                                100);
                        }
                        event.target.click();
                    };
                    button.onclick = (event) => this.likeClicked(event);
                });
            document.getElementsByClassName('l-player')[0]
                .querySelectorAll('.album-button').forEach((button) => {
                    button.ontouchend = (event) => {
                        event.preventDefault();
                        if (event.target.tagName == 'BUTTON') {
                            event.target.classList.add('touched');
                            setTimeout(() => event.target.classList.remove('touched'), 100);
                        } else {
                            event.target.parentNode.classList.add('touched');
                            setTimeout(() => event.target.parentNode.classList.remove('touched'),
                                100);
                        }
                        // event.target.click();
                    };
                    // button.onclick = (event) => this.albumClicked(event);
                });
            document.getElementsByClassName('l-player')[0]
                .querySelectorAll('.artist-button').forEach((button) => {
                    button.ontouchend = (event) => {
                        event.preventDefault();
                        if (event.target.tagName == 'BUTTON') {
                            event.target.classList.add('touched');
                            setTimeout(() => event.target.classList.remove('touched'), 100);
                        } else {
                            event.target.parentNode.classList.add('touched');
                            setTimeout(() => event.target.parentNode.classList.remove('touched'),
                                100);
                        }
                        event.target.click();
                    };
                    button.onclick = (event) => this.artistClicked(event);
                });
            document.getElementsByClassName('l-player')[0]
                .querySelectorAll('.remove-button').forEach((button) => {
                    button.ontouchend = (event) => {
                        event.preventDefault();
                        if (event.target.tagName == 'BUTTON') {
                            event.target.classList.add('touched');
                            setTimeout(() => event.target.classList.remove('touched'), 100);
                        } else {
                            event.target.parentNode.classList.add('touched');
                            setTimeout(() => event.target.parentNode.classList.remove('touched'),
                                100);
                        }
                        event.target.click();
                    };
                    button.onclick = (event) => this.trackDeleteButtonClick(event);
                });
        }
    }

    /**
     * Drag start
     * @param {Object} event
     */
    dragStart(event) {
        this.dragged = event.target;
    }

    /**
     * Drag over
     * @param {Object} event
     * @return {Boolean}
     */
    dragOver(event) {
        event.preventDefault();
        let row = event.target;
        while (!row.classList.contains('row')) {
            row = row.parentNode;
        }
        if (event.clientY < row.getBoundingClientRect().top + 25 &&
            row.previousSibling !== document.getElementsByClassName('drag-patch')[0]
        ) {
            row.insertAdjacentElement('beforebegin',
                document.getElementsByClassName('drag-patch')[0]);
            document.getElementsByClassName('drag-patch')[0].classList.remove('is-active');
        } else if (row.nextSibling !== document.getElementsByClassName('drag-patch')[0]) {
            row.insertAdjacentElement('afterend',
                document.getElementsByClassName('drag-patch')[0]);
            document.getElementsByClassName('drag-patch')[0].classList.remove('is-active');
        }
        document.getElementsByClassName('drag-patch')[0].classList.add('is-active');
        return false;
    }

    /**
     * Drag end
     */
    dragEnd() {
        document.getElementsByClassName('drag-patch')[0].classList.remove('is-active');
    }

    /**
     * Drop
     * @param {Object} event
     */
    drop(event) {
        event.stopPropagation();
        if (this.dragged.contains(event.target)) {
            return;
        }
        let row = event.target;
        while (!row.classList.contains('row')) {
            row = row.parentNode;
        }
        row.insertAdjacentElement('afterend', this.dragged);
        document.getElementsByClassName('drag-patch')[0].classList.remove('is-active');
        document.getElementsByClassName('current-marker')[0].insertAdjacentElement(
            'afterend', document.getElementsByClassName('drag-patch')[0]);
        this.eventBus.emit(PLAYER.MOVE_MARKER_TO_CURRENT);
        this.eventBus.emit(PLAYER.CHANGE_ORDER, this.dragged.getAttribute('id'),
            this.dragged.previousSibling.getAttribute('id'));
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
    likeClicked(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!User.exists()) {
            globalEventBus.emit(GLOBAL.REDIRECT, URL.LOGIN);
            return;
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
     * Переход на страницу артиста
     * @param {Object} event
     */
    artistClicked(event) {
        event.stopImmediatePropagation();
        let target = event.target;
        while (!target.classList.contains('l-player-track')) {
            target = target.parentNode;
        }
        globalEventBus.emit(GLOBAL.REDIRECT, target.children[1].children[1].getAttribute('href'));
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
            if (target.classList.contains('l-player-track') && target.getAttribute('id') !== null) {
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
        if (document.getElementsByClassName('track-list')[0].children.length === 2) {
            if (this.expanded) {
                this.triggerClick();
                this.footer = false;
            }
            this.locked = true;
            if (window.matchMedia(LAYOUT.MOBILE).matches) {
                this.resize();
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
        while (document.getElementsByClassName('track-list')[0].children.length > 2) {
            document.getElementsByClassName('track-list')[0].children[document
                .getElementsByClassName('track-list')[0].children.length - 1].remove();
        }
        if (this.expanded) {
            this.triggerClick();
        }
    }

    /**
     * Рисует новый трек в очереди
     * @param {Object} track
     */
    drawNew(track) {
        let crutch = document.createElement('div');
        crutch.innerHTML = template([track]);
        crutch = crutch.firstChild;
        document.getElementsByClassName('track-list')[0].insertAdjacentElement('beforeend', crutch);
        const trackRow = document.getElementById(track.id);
        trackRow.addEventListener('click', this.tracklistClick.bind(this));
        trackRow.addEventListener('mouseenter', this.tracklistMouseEnter.bind(this));
        trackRow.addEventListener('mouseleave', this.tracklistMouseLeave.bind(this));
        trackRow.addEventListener('dragstart', this.dragStart.bind(this));
        trackRow.addEventListener('dragover', this.dragOver.bind(this));
        trackRow.addEventListener('drop', this.drop.bind(this));
        trackRow.addEventListener('dragend', this.dragEnd.bind(this));
        trackRow.getElementsByClassName('delete-button')[0].addEventListener('click',
            this.trackDeleteButtonClick.bind(this));
        if (window.matchMedia(LAYOUT.MOBILE).matches || window.matchMedia(LAYOUT.TABLET).matches) {
            trackRow.getElementsByClassName('more-button')[0].ontouchend = (event) => {
                event.preventDefault();
                event.target.classList.add('touched');
                setTimeout(() => event.target.classList.remove('touched'), 200);
                event.target.click();
            };
            trackRow.getElementsByClassName('more-button')[0].onclick = (event) =>
                this.moreClicked(event);
            trackRow.getElementsByClassName('add-button')[0].ontouchend = (event) => {
                event.preventDefault();
                if (event.target.tagName == 'BUTTON') {
                    event.target.classList.add('touched');
                    setTimeout(() => event.target.classList.remove('touched'), 100);
                } else {
                    event.target.parentNode.classList.add('touched');
                    setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                }
                // event.target.click();
            };
            // trackRow.getElementsByClassName('add-button')[0].onclick = (event) => this.addToPlaylist.bind(this)(event);
            trackRow.getElementsByClassName('like-button')[0].ontouchend = (event) => {
                event.preventDefault();
                if (event.target.tagName == 'BUTTON') {
                    event.target.classList.add('touched');
                    setTimeout(() => event.target.classList.remove('touched'), 100);
                } else {
                    event.target.parentNode.classList.add('touched');
                    setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                }
                event.target.click();
            };
            trackRow.getElementsByClassName('like-button')[0].onclick = (event) =>
                this.likeClicked(event);
            trackRow.getElementsByClassName('album-button')[0].ontouchend = (event) => {
                event.preventDefault();
                if (event.target.tagName == 'BUTTON') {
                    event.target.classList.add('touched');
                    setTimeout(() => event.target.classList.remove('touched'), 100);
                } else {
                    event.target.parentNode.classList.add('touched');
                    setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                }
                // event.target.click();
            };
            // trackRow.getElementsByClassName('album-button')[0].onclick = (event) => this.albumClicked(event);
            trackRow.getElementsByClassName('artist-button')[0].ontouchend = (event) => {
                event.preventDefault();
                if (event.target.tagName == 'BUTTON') {
                    event.target.classList.add('touched');
                    setTimeout(() => event.target.classList.remove('touched'), 100);
                } else {
                    event.target.parentNode.classList.add('touched');
                    setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                }
                event.target.click();
            };
            trackRow.getElementsByClassName('artist-button')[0].onclick = (event) =>
                this.artistClicked(event);
            trackRow.getElementsByClassName('delete-button')[0].ontouchend = (event) => {
                event.preventDefault();
                if (event.target.tagName == 'BUTTON') {
                    event.target.classList.add('touched');
                    setTimeout(() => event.target.classList.remove('touched'), 100);
                } else {
                    event.target.parentNode.classList.add('touched');
                    setTimeout(() => event.target.parentNode.classList.remove('touched'), 100);
                }
                event.target.click();
            };
            trackRow.getElementsByClassName('delete-button')[0].onclick = (event) =>
                this.trackDeleteButtonClick(event);
        }
    }
}
