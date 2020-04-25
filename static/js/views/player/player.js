import {PLAYER, NAVBAR, DOM, GLOBAL, URL} from '@libs/constans';
import BaseView from '@libs/base_view';
import track from '@views/player/track.tmpl.xml';
import player from '@views/player/player.tmpl.xml';
import {globalEventBus} from '@libs/eventBus';
import ChoosePlaylist from '@components/choose_playlist_component/choose_playlist_component';
import User from '@libs/user';
import PlaylistComponent from '@components/playlist_component/playlist_component';
import TopTrackComponent from '@components/top_track_component/top_track_component';

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
        this.timelineDrag = false;
        this.volumeDrag = false;
        this.playing = false;
        this.shuffled = false;
        this.repeatState = 0;
        this.muted = false;
        this.volume = 1;
        this.locked = true;
        this.topTrackComponent = new TopTrackComponent(eventBus);
        this._choosePlaylist = new ChoosePlaylist(eventBus, PLAYER);
        this._playlistComponent = new PlaylistComponent(this.setDynamicEventListeners.bind(this));
        this.eventBus.on(PLAYER.DRAW_PLAY, this.drawPlay.bind(this));
        this.eventBus.on(PLAYER.DRAW_PAUSE, this.drawPause.bind(this));
        this.eventBus.on(PLAYER.TRACK_UPDATE, this.updateTrack.bind(this));
        this.eventBus.on(PLAYER.MOVE_MARKER, this.moveMarker.bind(this));
        this.eventBus.on(PLAYER.DRAW_TRACKLIST, this.drawTracklist.bind(this));
        this.eventBus.on(PLAYER.DRAW_TRACKLIST, this.setDynamicEventListeners.bind(this));
        this.eventBus.on(PLAYER.REMOVE_FROM_TRACKLIST, this.removeFromTracklist.bind(this));
        this.eventBus.on(PLAYER.REMOVE_FROM_TRACKLIST_ALL, this.removeFromTracklistAll.bind(this));
        this.eventBus.on(PLAYER.DRAW_TIMELINE, this.drawTimeline.bind(this));
        this.eventBus.on(PLAYER.DRAW_SHUFFLE, this.drawShuffle.bind(this));
        this.eventBus.on(PLAYER.DRAW_UNSHUFLE, this.drawUnshuffle.bind(this));
        this.eventBus.on(PLAYER.DRAW_REPEAT, this.drawRepeat.bind(this));
        this.eventBus.on(PLAYER.DRAW_REPEAT_ONE, this.drawRepeatOne.bind(this));
        this.eventBus.on(PLAYER.DRAW_UNREPEAT, this.drawUnrepeat.bind(this));
        this.eventBus.on(PLAYER.DRAW_MUTE, this.drawMute.bind(this));
        this.eventBus.on(PLAYER.DRAW_UNMUTE, this.drawUnmute.bind(this));
        globalEventBus.on(GLOBAL.COLLAPSE, this.collapse.bind(this));
    }

    /**
     * Позиционирует плеер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.PLAYER)[0]);
        this.top_track_component.render();
        this.setStaticEventListeners();
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
        document.getElementsByTagName('audio')[0].volume = this.volume;
        this.drawVolume(height);
        this.root.style.top = top.toString() + 'px';
        this.root.style.height = height.toString() + 'px';
        document.getElementsByClassName('player-trigger')[0]
            .style.height = height.toString() + 'px';
        this.drawVolume(document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height * this.volume);
    }

    /**
     * Sets static EventListeners
     */
    setStaticEventListeners() {
        window.addEventListener('resize', this.resize.bind(this));
        document.getElementsByTagName('body')[0]
            .addEventListener('DOMSubtreeModified', this.resize.bind(this));
        window.addEventListener('mouseup', this.windowMouseUp.bind(this));
        document.getElementsByTagName('audio')[0]
            .addEventListener('timeupdate', this.audioTimeUpdate.bind(this));
        document.getElementsByTagName('audio')[0]
            .addEventListener('ended', this.audioEnded.bind(this));
        document.getElementsByClassName('player-trigger')[0]
            .addEventListener('mouseover', this.triggerMouseOver.bind(this));
        document.getElementsByClassName('player-trigger')[0]
            .addEventListener('mouseout', this.triggerMouseOut.bind(this));
        document.getElementsByClassName('player-trigger')[0]
            .addEventListener('click', this.triggerClick.bind(this));
        document.getElementsByClassName('trigger-button')[0]
            .addEventListener('mouseover', this.triggerMouseOver.bind(this));
        document.getElementsByClassName('trigger-button')[0]
            .addEventListener('mouseout', this.triggerMouseOut.bind(this));
        document.getElementsByClassName('trigger-button')[0]
            .addEventListener('click', this.triggerClick.bind(this));
        document.getElementsByClassName('play-pause')[0]
            .addEventListener('click', this.playPauseButtonClick.bind(this));
        document.getElementById('prev').addEventListener('click', this.prevButtonClick.bind(this));
        document.getElementById('next').addEventListener('click', this.nextButtonClick.bind(this));
        document.getElementsByClassName('timeline')[0]
            .addEventListener('mouseover', this.timelineMouseOver.bind(this));
        document.getElementsByClassName('timeline')[0]
            .addEventListener('mouseout', this.timelineMouseOut.bind(this));
        document.getElementsByClassName('timeline-back')[0]
            .addEventListener('mousedown', this.timelineMouseDown.bind(this));
        document.getElementsByClassName('timeline-back')[0]
            .onmouseup = (event) => this.timelineMouseUp(event);
        document.getElementsByClassName('timeline-front')[0]
            .addEventListener('mousedown', this.timelineMouseDown.bind(this));
        document.getElementsByClassName('timeline-front')[0]
            .onmouseup = (event) => this.timelineMouseUp(event);
        document.getElementsByClassName('timeline-back')[0]
            .onmousemove = (event) => this.timelineMouseMove(event);
        document.getElementsByClassName('timeline-front')[0]
            .onmousemove = (event) => this.timelineMouseMove(event);
        document.getElementsByClassName('timeline-back')[0]
            .onclick = (event) => this.timelineClick(event);
        document.getElementsByClassName('timeline-front')[0]
            .onclick = (event) => this.timelineClick(event);
        document.getElementsByClassName('shuffle')[0]
            .addEventListener('mouseover', this.shuffleButtonMouseOver.bind(this));
        document.getElementsByClassName('shuffle')[0]
            .addEventListener('mouseout', this.shuffleButtonMouseOut.bind(this));
        document.getElementsByClassName('shuffle')[0]
            .addEventListener('click', this.shuffleButtonClick.bind(this));
        document.getElementsByClassName('repeat')[0]
            .addEventListener('mouseover', this.repeatButtonMouseOver.bind(this));
        document.getElementsByClassName('repeat')[0]
            .addEventListener('mouseout', this.repeatButtonMouseOut.bind(this));
        document.getElementsByClassName('repeat')[0]
            .addEventListener('click', this.repeatButtonClick.bind(this));
        document.getElementsByClassName('volume')[0]
            .addEventListener('mouseover', this.volumeButtonMouseOver.bind(this));
        document.getElementsByClassName('volume')[0]
            .addEventListener('mouseout', this.volumeButtonMouseOut.bind(this));
        document.getElementsByClassName('volume')[0]
            .addEventListener('click', this.volumeButtonClick.bind(this));
        document.getElementsByClassName('volume-scale')[0]
            .addEventListener('mouseover', this.volumeButtonMouseOver.bind(this));
        document.getElementsByClassName('volume-scale')[0]
            .addEventListener('mouseout', this.volumeButtonMouseOut.bind(this));
        document.getElementsByClassName('volume-scale-back')[0]
            .addEventListener('mousedown', this.volumeMouseDown.bind(this));
        document.getElementsByClassName('volume-scale-back')[0]
            .onmouseup = (event) => this.volumeMouseUp(event);
        document.getElementsByClassName('volume-scale-front')[0]
            .addEventListener('mousedown', this.volumeMouseDown.bind(this));
        document.getElementsByClassName('volume-scale-front')[0]
            .onmouseup = (event) => this.volumeMouseUp(event);
        document.getElementsByClassName('volume-scale-back')[0]
            .onclick = (event) => this.volumeScaleClick(event);
        document.getElementsByClassName('volume-scale-front')[0]
            .onclick = (event) => this.volumeScaleClick(event);
        document.getElementsByClassName('volume-scale-back')[0]
            .onmousemove = (event) => this.volumeMouseMove(event);
        document.getElementsByClassName('volume-scale-front')[0]
            .onmousemove = (event) => this.volumeMouseMove(event);
        window.onwheel = (event) => this.trackListWheel(event);
    }

    /**
     * Sets dynamic EventListeners
     */
    setDynamicEventListeners() {
        document.querySelectorAll('.track-list').forEach((row) => {
            row.onclick = (event) => this.tracklistClick(event);
        });
        document.querySelectorAll('.delete-button').forEach((button) => {
            button.onclick = (event) => this.trackDeleteButtonClick(event);
        });
        document.querySelectorAll('.favorite-button').forEach((button) => {
            button.onclick = (event) => this.trackFavoriteButtonClick(event);
        });
        document.querySelectorAll('.add-button').forEach((button) => {
            button.onclick = (event) => this.trackAddButtonClick(event);
        });
    }

    /**
     * Слушает отпускание клавиши мыши
     */
    windowMouseUp() {
        this.timelineDrag = false;
        this.volumeDrag = false;
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
        this.drawTimeline(document.getElementsByTagName('audio')[0].currentTime /
            document.getElementsByTagName('audio')[0].duration);
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
     * Слушает клик по кнопке воспроизвдения/паузы
     */
    playPauseButtonClick() {
        if (this.playing) {
            this.eventBus.emit(PLAYER.PAUSE);
        } else {
            this.eventBus.emit(PLAYER.PLAY);
        }
    }

    /**
     * Слушает клик по кнопке включения предыдущего трека
     */
    prevButtonClick() {
        this.eventBus.emit(PLAYER.PREVIOUS);
    }

    /**
     * Слушает клик по кнопке включения следующего трека
     */
    nextButtonClick() {
        this.eventBus.emit(PLAYER.NEXT, 'click');
    }

    /**
     * Слушает вход курсора в зону таймлайна
     */
    timelineMouseOver() {
        document.getElementsByClassName('current-time')[0].style.fontSize = '11px';
        document.getElementsByClassName('duration')[0].style.fontSize = '11px';
    }

    /**
     * Слушает выход курсора из зоны таймлайна
     */
    timelineMouseOut() {
        document.getElementsByClassName('current-time')[0].style.fontSize = '0';
        document.getElementsByClassName('duration')[0].style.fontSize = '0';
    }

    /**
     * Слушает нажатие клавиши мыши на таймлайне
     */
    timelineMouseDown() {
        this.timelineDrag = true;
    }

    /**
     * Слушает отпускание клавиши мыши на таймлайне
     * @param {Object} event
     */
    timelineMouseUp(event) {
        this.timelineDrag = false;
        const width = event.clientX - document.getElementsByClassName('timeline-back')[0]
            .getBoundingClientRect().x;
        const ratio = width / document.getElementsByClassName('timeline-back')[0]
            .getBoundingClientRect().width;
        this.eventBus.emit(PLAYER.REWIND, ratio);
    }

    /**
     * Слушает движение мыши по таймлайну
     * @param {Object} event
     */
    timelineMouseMove(event) {
        if (this.timelineDrag) {
            const width = event.clientX - document.getElementsByClassName('timeline-back')[0]
                .getBoundingClientRect().x;
            const ratio = width / document.getElementsByClassName('timeline-back')[0]
                .getBoundingClientRect().width;
            this.drawTimeline(ratio);
        }
    }

    /**
     * Слушает клик по таймлайну
     * @param {Object} event
     */
    timelineClick(event) {
        const width = event.clientX - document.getElementsByClassName('timeline-back')[0]
            .getBoundingClientRect().x;
        const ratio = width / document.getElementsByClassName('timeline-back')[0]
            .getBoundingClientRect().width;
        this.eventBus.emit(PLAYER.REWIND, ratio);
    }

    /**
     * Слушает вход курсора на кнопку перемешивания
     */
    shuffleButtonMouseOver() {
        if (!this.shuffled) {
            document.getElementsByClassName('shuffle')[0].style.opacity = '1';
        }
    }

    /**
     * Слушает выход курсора с кнопки перемешивания
     */
    shuffleButtonMouseOut() {
        if (!this.shuffled) {
            document.getElementsByClassName('shuffle')[0].style.opacity = '0.4';
        }
    }

    /**
     * Слушает клик по кнопке перемешивания
     */
    shuffleButtonClick() {
        if (!this.shuffled) {
            this.eventBus.emit(PLAYER.SHUFFLE, 'first');
        } else {
            this.eventBus.emit(PLAYER.UNSHUFFLE);
        }
    }

    /**
     * Слушает вход курсора на кнопку зацикливания
     */
    repeatButtonMouseOver() {
        if (this.repeatState === 0) {
            document.getElementsByClassName('repeat')[0].style.opacity = '1';
        }
    }

    /**
     * Слушает выход курсора с кнопки зацикливания
     */
    repeatButtonMouseOut() {
        if (this.repeatState === 0) {
            document.getElementsByClassName('repeat')[0].style.opacity = '0.4';
        }
    }

    /**
     * Слушает клик по кнопке зацикливания
     */
    repeatButtonClick() {
        switch (this.repeatState) {
        case 0:
            this.eventBus.emit(PLAYER.REPEAT);
            break;
        case 1:
            this.eventBus.emit(PLAYER.REPEAT_ONE);
            break;
        case 2:
            this.eventBus.emit(PLAYER.UNREPEAT);
            break;
        }
    }

    /**
     * Слушает вход курсора на кнопку громкости
     */
    volumeButtonMouseOver() {
        document.getElementsByClassName('volume-scale')[0]
            .style.transitionProperty = 'opacity, top';
        document.getElementsByClassName('volume-scale')[0].style.visibility = 'visible';
        document.getElementsByClassName('volume-scale')[0].style.opacity = '1';
        document.getElementsByClassName('volume-scale')[0].style.top = '-52px';
        document.getElementsByClassName('volume')[0].style.opacity = '1';
    }

    /**
     * Слушает выход курсора с кнопки громкости
     */
    volumeButtonMouseOut() {
        document.getElementsByClassName('volume-scale')[0]
            .style.transitionProperty = 'opacity, visibility, top';
        document.getElementsByClassName('volume-scale')[0].style.visibility = 'hidden';
        document.getElementsByClassName('volume-scale')[0].style.opacity = '0';
        document.getElementsByClassName('volume-scale')[0].style.top = '-42px';
        document.getElementsByClassName('volume')[0].style.opacity = '0.4';
    }

    /**
     * Слушает нажатие клавиши мыши на шкале громкости
     */
    volumeMouseDown() {
        this.volumeDrag = true;
    }

    /**
     * Слушает отпускание клавиши мыши на шкале громкости
     * @param {Object} event
     */
    volumeMouseUp(event) {
        this.volumeDrag = false;
        this.muted = false;
        const height = document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height -
            (event.clientY - document.getElementsByClassName('volume-scale-back')[0]
                .getBoundingClientRect().y);
        this.volume = height / document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height;
        document.getElementsByTagName('audio')[0].volume = this.volume;
        this.drawVolume(height);
    }

    /**
     * Слушает движение мыши по шкале громкости
     * @param {Object} event
     */
    volumeMouseMove(event) {
        if (this.volumeDrag) {
            const height = document.getElementsByClassName('volume-scale-back')[0]
                .getBoundingClientRect().height -
                (event.clientY - document.getElementsByClassName('volume-scale-back')[0]
                    .getBoundingClientRect().y);
            this.volume = height / document.getElementsByClassName('volume-scale-back')[0]
                .getBoundingClientRect().height;
            document.getElementsByTagName('audio')[0].volume = this.volume;
            this.drawVolume(height);
        }
    }

    /**
     * Слушает клик по шкале громкости
     * @param {Object} event
     */
    volumeScaleClick(event) {
        const height = document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height -
            (event.clientY - document.getElementsByClassName('volume-scale-back')[0]
                .getBoundingClientRect().y);
        this.volume = height / document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height;
        document.getElementsByTagName('audio')[0].volume = this.volume;
        this.drawVolume(height);
        this.drawUnmute();
    }

    /**
     * Слушает клик по кнопке громкости
     */
    volumeButtonClick() {
        if (this.muted) {
            this.eventBus.emit(PLAYER.UNMUTE);
        } else {
            this.eventBus.emit(PLAYER.MUTE);
        }
    }

    /**
     * Слушает скрол для прокрутки плейлиста
     * @param {Object} event
     */
    trackListWheel(event) {
        const delta = event.deltaY;
        const trackList = document.getElementsByClassName('track-list')[0];
        if (event.clientX > trackList.getBoundingClientRect().x &&
            event.clientX < trackList.getBoundingClientRect().x +
            trackList.getBoundingClientRect().width &&
            event.clientY > trackList.getBoundingClientRect().y &&
            event.clientY < trackList.getBoundingClientRect().y +
            trackList.getBoundingClientRect().height
        ) {
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
        while (current != null && !current.classList.contains('track-list')) {
            if (current.classList.contains('border-bottom') &&
                current.getAttribute('id') !== null) {
                return {'id': current.getAttribute('id')};
            }
            current = current.parentNode;
        }
        return '';
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
     * Рисует кнопку воспроизвдения/паузы как плей для режима паузы
     * (воспроизвдение по нажатию)
     */
    drawPlay() {
        document.getElementsByClassName('play-pause')[0].src = '/static/img/play.svg';
        this.playing = false;
    }

    /**
     * Рисует кнопку воспроизвдения/паузы как пауза для режима плей
     * (пауза по нажатию)
     */
    drawPause() {
        document.getElementsByClassName('play-pause')[0].src = '/static/img/pause.svg';
        this.playing = true;
    }

    /**
     * Обновляет текущий воспроизводимый трек
     * @param {Object} track
     */
    updateTrack(track) {
        const minutes = Math.floor(track.duration / 60);
        const seconds = Math.floor(track.duration % 60);
        document.getElementsByClassName('duration')[0].innerHTML = minutes.toString() + ':' +
            (seconds < 10 ? '0' : '') + seconds.toString();
        document.getElementsByClassName('current-time')[0].innerHTML = '0:00';
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

    /**
     * Рисует треки в плейлисте
     * @param {Object} tracks
     */
    drawTracklist(tracks) {
        this.eventBus.emit(PLAYER.TRACK_UPDATE, tracks[0]);
        for (let i = 0; i < tracks.length; i++) {
            document.getElementsByClassName('track-list')[0].innerHTML += track(tracks[i]);
        }
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
        }
    }

    /**
     * Очищает список воспроизвдения
     * @param {boolean} lock
     */
    removeFromTracklistAll(lock = false) {
        while (document.getElementsByClassName('track-list')[0].children.length > 1) {
            document.getElementsByClassName('track-list')[0].children[document
                .getElementsByClassName('track-list')[0].children.length - 1].remove();
        }
        if (lock && this.expanded) {
            this.triggerClick();
        }
        this.locked = lock;
    }

    /**
     * Рисует таймлайн в конкретном положении
     * @param {number} ratio
     */
    drawTimeline(ratio) {
        const width = ratio * document.getElementsByClassName('timeline-back')[0]
            .getBoundingClientRect().width;
        document.getElementsByClassName('timeline-front')[0].style.width = width.toString() + 'px';
        const minutes = Math.floor((ratio *
            document.getElementsByTagName('audio')[0].duration) / 60);
        const seconds = Math.floor((ratio *
            document.getElementsByTagName('audio')[0].duration) % 60);
        document.getElementsByClassName('current-time')[0].innerHTML = minutes.toString() + ':' +
            (seconds < 10 ? '0' : '') + seconds.toString();
    }

    /**
     * Рисует кнопку перемешивания в режиме перемешивания (активной)
     */
    drawShuffle() {
        document.getElementsByClassName('shuffle')[0].style.opacity = '1';
        this.shuffled = true;
    }

    /**
     * Рисует кнопку перемешивания в режиме воспроизвдения подряд (неактивной)
     */
    drawUnshuffle() {
        document.getElementsByClassName('shuffle')[0].style.opacity = '0.4';
        this.shuffled = false;
    }

    /**
     * Рисует кнопку зацикливания в режиме зацикливания всего плейлиста (активной, пустой внутри)
     */
    drawRepeat() {
        document.getElementsByClassName('repeat')[0].style.opacity = '1';
        this.repeatState = 1;
    }

    /**
     * Рисует кнопку зацикливания в режиме зацикливания одного трека (активной, с единичкой внутри)
     */
    drawRepeatOne() {
        document.getElementsByClassName('repeat')[0].src = '/static/img/repeat_one.svg';
        this.repeatState = 2;
    }

    /**
     * Рисует кнопку зацикливания в режиме одноразового проигрывания (неактивной)
     */
    drawUnrepeat() {
        document.getElementsByClassName('repeat')[0].src = '/static/img/repeat.svg';
        document.getElementsByClassName('repeat')[0].style.opacity = '0.4';
        this.repeatState = 0;
    }

    /**
     * Рисует кнопку громкости в беззучном режиме (без волн)
     */
    drawMute() {
        document.getElementsByClassName('volume')[0].src = '/static/img/volume_mute.svg';
        this.drawVolume(0);
        this.muted = true;
    }

    /**
     * Рисует кнопку громкости в режиме со звуком (с волнами)
     */
    drawUnmute() {
        if (this.volume <= 0.5) {
            document.getElementsByClassName('volume')[0].src = '/static/img/volume_down.svg';
        } else {
            document.getElementsByClassName('volume')[0].src = '/static/img/volume_up.svg';
        }
        this.drawVolume(document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height * this.volume);
        this.muted = false;
    }

    /**
     * Рисует шкалу громкости с определённым значением
     * @param {number} height
     */
    drawVolume(height) {
        if (height === 0) {
            document.getElementsByClassName('volume-scale-front')[0].style.height = '0';
            return;
        }
        document.getElementsByClassName('volume-scale-front')[0].style.top = 0 - height.toString() +
            'px';
        document.getElementsByClassName('volume-scale-front')[0].style.height = height.toString() +
            'px';
    }
}
