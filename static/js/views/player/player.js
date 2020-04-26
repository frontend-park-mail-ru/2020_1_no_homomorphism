import {PLAYER, NAVBAR, DOM, GLOBAL} from '@libs/constans';
import BaseView from '@libs/base_view';
import player from '@views/player/player.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choose_playlist_component/choose_playlist_component';
import PlaylistComponent from '@components/playlist_component/playlist_component';
import TopTrackComponent from '@components/top_track_component/top_track_component';
import PlayerTrackListComponent from
    '@components/player_track_list_component/player_track_list_component';
import PlayerControlComponent from '@components/player_control_component/player_control_component';

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
        this.topTrackComponent = new TopTrackComponent(eventBus);
        this.trackListComponent = new PlayerTrackListComponent(eventBus);
        this.playerControlComponent = new PlayerControlComponent(eventBus);
        this._choosePlaylist = new ChoosePlaylist(eventBus, PLAYER);
        this._playlistComponent = new PlaylistComponent(
            this.trackListComponent.setEventListeners.bind(this));
        [
            [PLAYER.DRAW_TRACKLIST, this.trackListComponent.drawTracklist, this],
            [PLAYER.DRAW_TRACKLIST, this.trackListComponent.setEventListeners,
                this.trackListComponent],
            [PLAYER.REMOVE_FROM_TRACKLIST, this.trackListComponent.removeFromTracklist, this],
            [PLAYER.REMOVE_FROM_TRACKLIST_ALL, this.trackListComponent.removeFromTracklistAll,
                this],
            [PLAYER.MOVE_MARKER, this.moveMarker, this],
        ].forEach((subscription) => {
            this.eventBus.on(subscription[0], subscription[1].bind(subscription[2]));
        });
        globalEventBus.on(GLOBAL.COLLAPSE, this.collapse.bind(this));
    }

    /**
     * Позиционирует плеер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.PLAYER)[0]);
        this.topTrackComponent.render();
        this.playerControlComponent.render();
        this.setEventListeners();
        this.resize();
    }

    /**
     * Действия при изменении размера
     */
    resize() {
        const body = document.getElementsByTagName('body')[0];
        const left = (
            this.expanded ?
                body.clientWidth - this.root.clientWidth :
                body.clientWidth - 13
        );
        this.root.style.left = left.toString() + 'px';
        const top = NAVBAR.HEIGHT;
        const height = document.documentElement.clientHeight - top;
        document.getElementsByTagName('audio')[0].volume = this.playerControlComponent.volume;
        // this.playerControlComponent.drawVolume(height);
        this.root.style.top = top.toString() + 'px';
        this.root.style.height = height.toString() + 'px';
        document.getElementsByClassName('player-trigger')[0]
            .style.height = height.toString() + 'px';
    }

    /**
     * Sets static EventListeners
     */
    setEventListeners() {
        [
            [window, 'resize', this.resize],
            [document.getElementsByTagName('body')[0], 'DOMSubtreeModified', this.resize],
            [document.getElementsByTagName('audio')[0], 'timeupdate', this.audioTimeUpdate],
            [document.getElementsByTagName('audio')[0], 'ended', this.audioEnded],
            [document.querySelector('.player-trigger'), 'mouseover', this.triggerMouseOver],
            [document.querySelector('.player-trigger'), 'mouseout', this.triggerMouseOut],
            [document.querySelector('.player-trigger'), 'click', this.triggerClick],
            [document.querySelector('.trigger-button'), 'mouseover', this.triggerMouseOver],
            [document.querySelector('.trigger-button'), 'mouseout', this.triggerMouseOut],
            [document.querySelector('.trigger-button'), 'click', this.triggerClick],
        ].forEach((el) => {
            el[0].addEventListener(el[1], el[2].bind(this));
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
        document.getElementsByClassName('trigger-button')[0].classList
            .add('is-mouse-on');
        document.getElementsByClassName('player-trigger')[0].classList
            .add('is-mouse-on');
        document.getElementsByClassName('player-trigger-arrow')[0].style.visibility = 'visible';
    }

    /**
     * Слушает выход курсора с триггера плеера
     */
    triggerMouseOut() {
        document.getElementsByClassName('trigger-button')[0].classList
            .remove('is-mouse-on');
        document.getElementsByClassName('player-trigger')[0].classList
            .remove('is-mouse-on');
        document.getElementsByClassName('player-trigger-arrow')[0].style.visibility = 'hidden';
    }

    /**
     * Слушает клик мышью по триггеру плеера
     */
    triggerClick() {
        if (this.locked === true) {
            return;
        }
        if (this.expanded) {
            document.getElementsByClassName('player-trigger-arrow')[0]
                .style.transform = 'rotate(180deg)';
        } else {
            document.getElementsByClassName('player-trigger-arrow')[0]
                .style.transform = 'rotate(0)';
        }
        const body = document.getElementsByTagName('body')[0];
        const left = (
            this.expanded ?
                body.clientWidth - 13 :
                body.clientWidth - this.root.clientWidth
        );
        this.root.style.left = left + 'px';
        this.expanded = !this.expanded;
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
        track2.style.marginLeft = '5px';
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
                track1.style.marginLeft = '0';
            }
        }, 250);
    }
}
