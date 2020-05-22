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
        this.triggerTouchedY = undefined;
        this.playerTouchedY = undefined;
        this.topTrackComponent = new TopTrackComponent(eventBus);
        this.trackListComponent = new PlayerTrackListComponent(eventBus);
        this.playerControlComponent = new PlayerControlComponent(eventBus);
        this._choosePlaylist = new ChoosePlaylist(eventBus, PLAYER);
        this._playlistComponent = new PlaylistComponent(
            this.trackListComponent.setEventListeners.bind(this));
        this.subscribe();
        globalEventBus.on(GLOBAL.COLLAPSE, this.collapse.bind(this));
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
        const mobile = window.matchMedia(LAYOUT.MOBILE);
        if (mobile.matches) {
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
        if (this.footer) {
            return;
        }
        const body = document.documentElement;
        const mobile = window.matchMedia(LAYOUT.MOBILE);
        const tablet = window.matchMedia(LAYOUT.TABLET);
        const left = (
            mobile.matches ?
                0 :
                (this.expanded ? body.clientWidth - this.root.clientWidth : body.clientWidth - 13)
        );
        this.root.style.left = left.toString() + 'px';
        const top =
            mobile.matches ?
                (this.expanded ?
                    NAVBAR.HEIGHT :
                    document.getElementsByTagName('audio')[0].currentSrc !== '' ?
                        NAVBAR.HEIGHT :
                        body.clientHeight) :
                NAVBAR.HEIGHT;
        this.root.style.top = top.toString() + 'px';
        document.getElementsByTagName('audio')[0].volume = this.playerControlComponent.volume;
        if (mobile.matches) {
            if (this.expanded) {
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom = '0';
            } else {
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom =
                    (top - body.clientHeight).toString() + 'px';
            }
        }
        let height = body.clientHeight - top;
        if (height === 0) {
            return;
        }
        this.root.style.height = height.toString() + 'px';
        document.getElementsByClassName('player-trigger')[0]
            .style.height = height.toString() + 'px';
        if (tablet.matches) {
            document.getElementsByClassName('track-list')[0].style.height = (body.clientHeight -
                NAVBAR.HEIGHT).toString() + 'px';
        } else {
            height -= document.getElementsByClassName('container-audio')[0].clientHeight +
                document.getElementsByClassName('l-music-bar')[0].clientHeight +
                document.getElementsByClassName('patch')[0].clientHeight +
                (mobile.matches ?
                    document.getElementsByClassName('player-trigger-row')[0].clientHeight :
                    0);
            document.getElementsByClassName('track-list')[0].style.height =
                height.toString() + 'px';
        }
    }

    /**
     * Sets static EventListeners
     */
    setEventListeners() {
        [{
            element: window,
            event: 'resize',
            callback: this.resize,
        }, {
            element: document.getElementsByTagName('body')[0],
            event: 'DOMSubtreeModified',
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
            element: window,
            event: 'touchend',
            callback: this.triggerSwipe,
        }, {
            element: document.getElementsByClassName('l-player')[0],
            event: 'touchstart',
            callback: this.playerTouch,
        }, {
            element: document.getElementsByClassName('l-player')[0],
            event: 'touchend',
            callback: this.playerSwipe,
        }].forEach((el) => {
            el.element.addEventListener(el.event, el.callback.bind(this));
        });
        this.playerControlComponent.setEventListeners();
    }

    /**
     * Слушает обновление времени аудио
     */
    audioTimeUpdate() {
        if (
            isNaN(document.getElementsByTagName('audio')[0].currentTime /
                document.getElementsByTagName('audio')[0].duration) ||
            this.timelineDrag
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
            document.querySelector('.player-trigger-arrow').classList.remove('is-rotated-0');
        } else {
            document.querySelector('.player-trigger-arrow').classList.add('is-rotated-0');
        }
        const body = document.getElementsByTagName('body')[0];
        const mobile = window.matchMedia(LAYOUT.MOBILE);
        if (mobile.matches) {
            if (this.expanded) {
                document.getElementsByClassName('track-list')[0].style.top = '0px';
                this.footer = true;
                document.getElementsByClassName('player-trigger-arrow-row')[0].classList
                    .add('is-hidden');
                setTimeout(() => {
                    document.getElementsByClassName('l-player')[0].classList.add('l-player-footer');
                    document.getElementsByClassName('l-player')[0].classList.remove('l-player');
                    document.getElementsByClassName('l-player-footer')[0].appendChild(
                        document.getElementsByClassName('timeline')[0],
                    );
                    document.getElementById('cover').classList.add('in-footer-cover');
                }, 600);
                setTimeout(() => {
                    document.getElementsByClassName('l-player-footer')[0].appendChild(
                        document.getElementsByClassName('play-pause')[0],
                    );
                }, 1000);
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom = '60px';
            } else {
                this.footer = false;
                document.getElementsByClassName('player-trigger-arrow-row')[0].classList
                    .remove('is-hidden');
                document.getElementsByClassName('l-player-footer')[0].classList.add('l-player');
                document.getElementsByClassName('l-player')[0].classList.remove('l-player-footer');
                document.getElementsByClassName('container-audio')[0].insertBefore(
                    document.getElementsByClassName('timeline')[0],
                    document.getElementsByClassName('control-elements')[0],
                );
                document.getElementsByClassName('control-elements')[0].insertBefore(
                    document.getElementsByClassName('play-pause')[0],
                    document.getElementById('next'),
                );
                document.getElementById('cover').classList.remove('in-footer-cover');
                document.getElementsByClassName('l-pop-up-container')[0].style.bottom = '0';
            }
            const top =
                this.expanded ?
                    document.documentElement.clientHeight - 60 :
                    NAVBAR.HEIGHT;
            this.root.style.top = top + 'px';
        } else {
            const left =
                this.expanded ?
                    body.clientWidth - 13 :
                    body.clientWidth - this.root.clientWidth;
            this.root.style.left = left + 'px';
        }
        this.expanded = !this.expanded;
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
     * Слушает свайп по триггеру плеера
     * @param {Object} event
     */
    triggerSwipe(event) {
        if (this.triggerTouchedY) {
            this.triggerClick();
        }
    }

    /**
     * Слушает touchstart по плееру
     * @param {Object} event
     */
    playerTouch(event) {
        if (this.footer ||
            document.getElementsByClassName('track-list')[0].contains(event.target)
        ) {
            return;
        }
        setTimeout(() => {
            this.playerTouchedY = event.changedTouches[0].clientY;
            event.preventDefault();
            event.stopImmediatePropagation();
        }, 100);
        setTimeout(() => {
            this.playerTouchedY = undefined;
        }, 500);
    }

    /**
     * Слушает свайп по плееру
     * @param {Object} event
     */
    playerSwipe(event) {
        if (this.playerTouchedY && !this.footer) {
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
        const heightDifference = track1.getBoundingClientRect().y -
            track2.getBoundingClientRect().y;
        const base = document.getElementsByClassName('track-list')[0].children[1]
            .getBoundingClientRect().y;
        track2.classList.remove('is-margin-left-0');
        track2.classList.add('is-margin-left-5');
        marker.style.height = (50 + Math.abs(heightDifference)).toString() + 'px';
        if (heightDifference < 0) {
            setTimeout(() => {
                marker.style.top = (track2.getBoundingClientRect().y - base + 5).toString() + 'px';
            }, 250);
        } else {
            marker.style.top = (track2.getBoundingClientRect().y - base + 5).toString() + 'px';
        }
        setTimeout(() => {
            marker.style.height = '50px';
            if (heightDifference !== 0) {
                track1.classList.remove('is-margin-left-5');
                track1.classList.add('is-margin-left-0');
            }
        }, 250);
    }
}
