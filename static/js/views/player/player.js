import {PLAYER, NAVBAR, DOM, GLOBAL, LAYOUT} from '@libs/constants';
import BaseView from '@libs/base_view';
import player from '@views/player/player.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choose_playlist/choose_playlist';
import PlaylistComponent from '@components/playlist/playlist';
import TopTrackComponent from '@components/top_track/top_track';
import PlayerTrackListComponent from '@components/player_track_list/player_track_list';
import PlayerControlComponent from '@components/player_control/player_control';

/**
 *  вью для плеера
 */
export default class PlayerView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(player);
        this.eventBus = eventBus;
        this.expanded = false;
        this.locked = true;
        this.footer = false;
        this.layout = {};
        this.topTrackComponent = new TopTrackComponent(eventBus);
        this.trackListComponent = new PlayerTrackListComponent(eventBus);
        this.playerControlComponent = new PlayerControlComponent(eventBus);
        this._choosePlaylist = new ChoosePlaylist(eventBus, PLAYER);
        this._playlistComponent = new PlaylistComponent(
            this.trackListComponent.setEventListeners.bind(this));
        this.subscribe();
        globalEventBus.on(GLOBAL.COLLAPSE, this.collapse.bind(this));
        globalEventBus.on(GLOBAL.COLLAPSE_IF_MOBILE, this.collapseIfMobile.bind(this));
    }

    /**
     * Подписка на события eventBus
     */
    subscribe() {
        [{
            event: PLAYER.DRAW_TRACKLIST,
            callback: this.trackListComponent.drawTracklist,
            binding: this,
        }, {
            event: PLAYER.DRAW_TRACKLIST,
            callback: this.trackListComponent.setEventListeners,
            binding: this.trackListComponent,
        }, {
            event: PLAYER.REMOVE_FROM_TRACKLIST,
            callback: this.trackListComponent.removeFromTracklist,
            binding: this,
        }, {
            event: PLAYER.REMOVE_FROM_TRACKLIST_ALL,
            callback: this.trackListComponent.removeFromTracklistAll,
            binding: this,
        }, {
            event: PLAYER.MOVE_MARKER,
            callback: this.moveMarker,
            binding: this,
        }, {
            event: PLAYER.MOVE_MARKER_TO_CURRENT,
            callback: this.moveMarkerToCurrent,
            binding: this,
        }].forEach((subscription) => {
            this.eventBus.on(subscription.event, subscription.callback.bind(subscription.binding));
        });
    }

    /**
     * Позиционирует плеер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.PLAYER)[0]);
        this.checkLayout();
        if (this.layout.mobile) {
            document.getElementsByClassName('l-player')[0].classList.add('l-player-footer');
        }
        this.topTrackComponent.render();
        this.playerControlComponent.render();
        this.setEventListeners();
        this.resize();
    }

    /**
     * Действия при изменении размера
     */
    resize() {
        const body = document.documentElement;
        this.checkLayout();
        let left;
        let top;
        let height;
        let callCollapse = false;
        switch (true) {
        case this.layout.mobile:
            if (this.footer) {
                return;
            }
            // ---- CHECK CLASSES ----
            document.getElementById('cover').classList.add('animated-cover');
            if (!this.expanded || this.locked) {
                if (!this.locked) {
                    this.footer = true;
                    callCollapse = true;
                    this.expanded = true;
                } else {
                    if (!document.getElementsByClassName('l-player-footer')[0]) {
                        document.getElementsByClassName('l-player')[0]
                            .classList.add('l-player-footer');
                        document.getElementsByClassName('l-player-footer')[0]
                            .classList.remove('l-player');
                    }
                }
            }
            // ---- LEFT ----
            this.root.style.left = '0';
            // ---- TOP ----
            top = this.locked ?
                body.clientHeight :
                this.expanded ?
                    NAVBAR.HEIGHT :
                    body.clientHeight - NAVBAR.HEIGHT;
            this.root.style.top = top.toString() + 'px';
            // ---- HEIGHT ----
            height = body.clientHeight - NAVBAR.HEIGHT;
            this.root.style.height = height.toString() + 'px';
            height -= document.getElementsByClassName('container-audio')[0].clientHeight +
                document.getElementsByClassName('l-music-bar')[0].clientHeight +
                document.getElementsByClassName('patch')[0].clientHeight +
                document.getElementsByClassName('player-trigger-row')[0].clientHeight;
            document.getElementsByClassName('track-list')[0].style.height =
                height.toString() + 'px';
            // ---- POP-UP CONTAINER ----
            if (this.expanded || this.locked) {
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom = '0';
            } else {
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom =
                    (NAVBAR.HEIGHT).toString() + 'px';
            }
            if (callCollapse) {
                this.triggerClick();
            }
            break;
        case this.layout.tablet:
            // ---- CHECK CLASSES ----
            document.getElementById('cover').classList.remove('animated-cover');
            if (this.footer) {
                this.expandFooter();
            }
            this.footer = false;
            if (document.getElementsByClassName('l-player-footer')[0]) {
                document.getElementsByClassName('l-player-footer')[0].classList.add('l-player');
                document.getElementsByClassName('l-player')[0].classList.remove('l-player-footer');
            }
            // ---- LEFT ----
            left = this.expanded ?
                body.clientWidth - this.root.clientWidth : body.clientWidth - 13;
            this.root.style.left = left.toString() + 'px';
            // ---- TOP ----
            this.root.style.top = NAVBAR.HEIGHT.toString() + 'px';
            // ---- HEIGHT ----
            height = body.clientHeight - top;
            this.root.style.height = height.toString() + 'px';
            document.getElementsByClassName('player-trigger')[0]
                .style.height = height.toString() + 'px';
            document.getElementsByClassName('track-list')[0].style.height =
                height.toString() + 'px';
            break;
        case this.layout.desktop:
            // ---- CHECK CLASSES ----
            document.getElementById('cover').classList.remove('animated-cover');
            if (document.getElementsByClassName('l-player-footer')[0]) {
                document.getElementsByClassName('l-player-footer')[0].classList.add('l-player');
                document.getElementsByClassName('l-player')[0].classList.remove('l-player-footer');
            }
            // ---- LEFT ----
            left = this.expanded ?
                body.clientWidth - this.root.clientWidth : body.clientWidth - 13;
            this.root.style.left = left.toString() + 'px';
            // ---- TOP ----
            this.root.style.top = NAVBAR.HEIGHT.toString() + 'px';
            // ---- HEIGHT ----
            height = body.clientHeight - top;
            this.root.style.height = height.toString() + 'px';
            document.getElementsByClassName('player-trigger')[0]
                .style.height = height.toString() + 'px';
            height -= document.getElementsByClassName('container-audio')[0].clientHeight +
                document.getElementsByClassName('l-music-bar')[0].clientHeight +
                document.getElementsByClassName('patch')[0].clientHeight;
            document.getElementsByClassName('track-list')[0].style.height =
                height.toString() + 'px';
            break;
        }
    }

    /**
     * Проверяет размеры окна
     */
    checkLayout() {
        switch (true) {
        case window.matchMedia(LAYOUT.MOBILE).matches:
            this.layout.mobile = true;
            this.layout.tablet = false;
            this.layout.desktop = false;
            break;
        case window.matchMedia(LAYOUT.TABLET).matches:
            this.layout.mobile = false;
            this.layout.tablet = true;
            this.layout.desktop = false;
            break;
        default:
            this.layout.mobile = false;
            this.layout.tablet = false;
            this.layout.desktop = true;
        }
    }

    /**
     * Sets static EventListeners
     */
    setEventListeners() {
        document.getElementsByTagName('body')[0].addEventListener('DOMSubtreeModified', (event) => {
            const player = document.getElementsByClassName('l-player')[0] ?
                document.getElementsByClassName('l-player')[0] :
                document.getElementsByClassName('l-player-footer')[0];
            if (!player.contains(event.target)) {
                this.resize();
            }
        });
        [{
            element: window,
            event: 'orientationchange',
            callback: this.resize,
        }, {
            element: window,
            event: 'resize',
            callback: this.resize,
        }, {
            element: document.getElementsByTagName('audio')[0],
            event: 'timeupdate',
            callback: this.audioTimeUpdate,
        }, {
            element: document.getElementsByTagName('audio')[0],
            event: 'ended',
            callback: this.audioEnded,
        }, {
            element: document.querySelector('.player-trigger'),
            event: 'mouseover',
            callback: this.triggerMouseOver,
        }, {
            element: document.querySelector('.player-trigger'),
            event: 'mouseout',
            callback: this.triggerMouseOut,
        }, {
            element: document.querySelector('.player-trigger'),
            event: 'click',
            callback: this.triggerClick,
        }, {
            element: document.querySelector('.trigger-button'),
            event: 'mouseover',
            callback: this.triggerMouseOver,
        }, {
            element: document.querySelector('.trigger-button'),
            event: 'mouseout',
            callback: this.triggerMouseOut,
        }, {
            element: document.querySelector('.trigger-button'),
            event: 'click',
            callback: this.triggerClick,
        }, {
            element: document.getElementsByClassName('player-trigger-row')[0],
            event: 'touchstart',
            callback: this.triggerTouch,
        }, {
            element: document.getElementsByClassName('player-trigger-row')[0],
            event: 'touchend',
            callback: this.triggerTouchEnd,
        }, {
            element: window,
            event: 'touchend',
            callback: this.triggerSwipe,
        }].forEach((el) => {
            el.element.addEventListener(el.event, el.callback.bind(this));
        });
        this.playerControlComponent.setEventListeners();
    }

    /**
     * Слушает обновление времени аудио
     */
    audioTimeUpdate() {
        if (isNaN(document.getElementsByTagName('audio')[0].currentTime /
            document.getElementsByTagName('audio')[0].duration) || this.timelineDrag
        ) {
            return;
        }
        this.playerControlComponent.drawTimeline(document.getElementsByTagName('audio')[0]
            .currentTime / document.getElementsByTagName('audio')[0].duration);
    }

    /**
     * Слушает завершение воспроизвдения
     */
    audioEnded() {
        this.eventBus.emit(PLAYER.NEXT, 'self');
    }

    /**
     * Слушает вход курсора на триггер плеера
     */
    triggerMouseOver() {
        document.getElementsByClassName('trigger-button')[0].classList.add('is-mouse-on');
        document.getElementsByClassName('player-trigger')[0].classList.add('is-mouse-on');
        document.getElementsByClassName('player-trigger-arrow')[0].classList.add('is-visible');
    }

    /**
     * Слушает выход курсора с триггера плеера
     */
    triggerMouseOut() {
        document.getElementsByClassName('trigger-button')[0].classList.remove('is-mouse-on');
        document.getElementsByClassName('player-trigger')[0].classList.remove('is-mouse-on');
        document.getElementsByClassName('player-trigger-arrow')[0].classList.remove('is-visible');
    }

    /**
     * Слушает клик мышью по триггеру плеера
     */
    triggerClick() {
        if (this.locked) {
            return;
        }
        if (this.expanded) {
            setTimeout(() => {
                document.querySelector('.player-trigger-arrow').classList.remove('is-rotated-0');
            }, 750);
        } else {
            setTimeout(() => {
                document.querySelector('.player-trigger-arrow').classList.add('is-rotated-0');
            }, 750);
        }
        const body = document.documentElement;
        this.expanded = !this.expanded;
        let left;
        let top;
        switch (true) {
        case this.layout.mobile:
            document.getElementById('cover').classList.add('animated-cover');
            this.footer = !this.expanded;
            if (this.expanded) {
                document.getElementsByClassName('player-trigger-arrow-row')[0]
                    .classList.remove('is-hidden');
                document.getElementsByClassName('l-player-footer')[0].classList.add('l-player');
                document.getElementsByClassName('l-player')[0].classList.remove('l-player-footer');
                document.getElementsByClassName('container-audio')[0].insertBefore(
                    document.getElementsByClassName('timeline')[0],
                    document.getElementsByClassName('control-elements')[0]);
                document.getElementsByClassName('control-elements')[0].insertBefore(
                    document.getElementsByClassName('play-pause')[0],
                    document.getElementById('next'));
                document.getElementById('cover').classList.remove('in-footer-cover');
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom = '0';
            } else {
                document.getElementsByClassName('player-trigger-arrow-row')[0]
                    .classList.add('is-hidden');
                document.getElementsByClassName('track-list')[0].style.top = '0';
                setTimeout(() => {
                    document.getElementsByClassName('l-player')[0].classList.add('l-player-footer');
                    document.getElementsByClassName('l-player')[0].classList.remove('l-player');
                    document.getElementsByClassName('l-player-footer')[0].appendChild(
                        document.getElementsByClassName('timeline')[0]);
                    document.getElementById('cover').classList.add('in-footer-cover');
                }, 300);
                setTimeout(() => {
                    document.getElementsByClassName('l-player-footer')[0].appendChild(
                        document.getElementsByClassName('play-pause')[0]);
                }, 500);
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom = '60px';
            }
            top = this.expanded ? NAVBAR.HEIGHT : body.clientHeight - NAVBAR.HEIGHT;
            this.root.style.top = top + 'px';
            break;
        case this.layout.tablet:
            document.getElementById('cover').classList.remove('animated-cover');
            left = this.expanded ? body.clientWidth - this.root.clientWidth : body.clientWidth - 13;
            this.root.style.left = left + 'px';
            if (this.expanded) {
                document.getElementsByClassName('player-trigger')[0]
                    .classList.remove('is-z-index-top');
            } else {
                document.getElementsByClassName('player-trigger')[0]
                    .classList.add('is-z-index-top');
            }
            break;
        case this.layout.desktop:
            document.getElementById('cover').classList.remove('animated-cover');
            left = this.expanded ? body.clientWidth - this.root.clientWidth : body.clientWidth - 13;
            this.root.style.left = left + 'px';
            break;
        }
    }

    /**
     * разворачивает плеер из состояния футера
     */
    expandFooter() {
        document.getElementsByClassName('player-trigger-arrow-row')[0]
            .classList.remove('is-hidden');
        if (document.getElementsByClassName('l-player-footer')[0]) {
            document.getElementsByClassName('l-player-footer')[0].classList.add('l-player');
            document.getElementsByClassName('l-player')[0].classList.remove('l-player-footer');
        }
        document.getElementsByClassName('container-audio')[0].insertBefore(
            document.getElementsByClassName('timeline')[0],
            document.getElementsByClassName('control-elements')[0]);
        document.getElementsByClassName('control-elements')[0].insertBefore(
            document.getElementsByClassName('play-pause')[0],
            document.getElementById('next'));
        document.getElementById('cover').classList.remove('in-footer-cover');
        document.getElementsByClassName('l-pop-up-container')[0].style.bottom = '0';
    }

    /**
     * Слушает touchstart по триггеру плеера
     * @param {Object} event
     */
    triggerTouch(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.triggerTouchedY = event.changedTouches[0].clientY;
        setTimeout(() => {
            this.triggerTouchedY = undefined;
        }, 500);
    }

    /**
     * Слушает нажатие по триггеру плеера
     * @param {Object} event
     */
    triggerTouchEnd(event) {
        if (this.triggerTouchedY &&
            Math.abs(event.changedTouches[0].clientY - this.triggerTouchedY) < 100
        ) {
            this.triggerClick();
        }
    }

    /**
     * Слушает свайп по триггеру плеера
     * @param {Object} event
     */
    triggerSwipe(event) {
        if (this.triggerTouchedY &&
            Math.abs(event.changedTouches[0].clientY - this.triggerTouchedY) > 300
        ) {
            this.triggerClick();
        }
    }

    /**
     * Получение плейлистов пользователя
     */
    getProfilePlaylists() {
        this._playlistComponent.getProfilePlaylistsApi(this.callChoosePlaylist.bind(this));
    }

    /**
     * Вызов компоненты choosePlaylist
     * @param {Array} playlistList
     */
    callChoosePlaylist(playlistList) {
        this._choosePlaylist
            .render(this.setTracksEventListeners.bind(this), playlistList);
    }

    /**
     * Сворачивает плеер, если он развёрнут
     */
    collapse() {
        if (this.expanded) {
            this.triggerClick();
        }
    }

    /**
     * Сворачивает плеер, если он развёрнут
     */
    collapseIfMobile() {
        if (this.expanded && (window.matchMedia(LAYOUT.MOBILE).matches ||
            window.matchMedia(LAYOUT.TABLET).matches)
        ) {
            this.triggerClick();
        }
    }

    /**
     * Передвигает маркер между треками
     * @param {string} currentId
     * @param {string} newId
     */
    moveMarker(currentId, newId) {
        if (document.querySelectorAll('.track-list .row').length === 0) {
            return;
        }
        const marker = document.getElementsByClassName('current-marker')[0];
        const track1 = document.getElementById(currentId);
        const track2 = document.getElementById(newId);
        const track2BCR = track2.getBoundingClientRect();
        const heightDifference = track1.getBoundingClientRect().y -
            track2BCR.y;
        const base = document.getElementsByClassName('track-list')[0].children[2]
            .getBoundingClientRect().y;
        track2.classList.add('is-margin-left-5');
        marker.style.height = (50 + Math.abs(heightDifference)).toString() + 'px';
        if (heightDifference < 0) {
            setTimeout(() => {
                marker.style.top = (track2BCR.y - base + 5).toString() + 'px';
            }, 250);
        } else {
            marker.style.top = (track2BCR.y - base + 5).toString() + 'px';
        }
        marker.setAttribute('current-id', track2.getAttribute('id'));
        setTimeout(() => {
            marker.style.height = '50px';
            if (heightDifference !== 0) {
                track1.classList.remove('is-margin-left-5');
            }
        }, 250);
    }

    /**
     * Передвигает маркер к треку
     */
    moveMarkerToCurrent() {
        if (document.querySelectorAll('.track-list .row').length === 0) {
            return;
        }
        const marker = document.getElementsByClassName('current-marker')[0];
        const track = document.getElementById(marker.getAttribute('current-id'));
        const base = document.getElementsByClassName('track-list')[0].children[1]
            .getBoundingClientRect().y;
        marker.style.top = (track.getBoundingClientRect().y - base + 5).toString() + 'px';
        marker.style.height = '50px';
    }
}
