import * as C from '../libs/constans.js';
/**
 *  вью для плеера
 */
export class PlayerView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.expanded = false;
        this.timelineDrag = false;
        this.volumeDrag = false;
        this.playing = false;
        this.shuffled = false;
        this.repeatState = 0;
        this.muted = false;
        this.volume = 1;
        this.eventBus.on(C.DRAW_PLAY, this.drawPlay.bind(this));
        this.eventBus.on(C.DRAW_PAUSE, this.drawPause.bind(this));
        this.eventBus.on(C.TRACK_UPDATE, this.updateTrack.bind(this));
        this.eventBus.on(C.DRAW_TRACKLIST, this.drawTracklist.bind(this));
        this.eventBus.on(C.DRAW_TIMELINE, this.drawTimeline.bind(this));
        this.eventBus.on(C.DRAW_SHUFFLE, this.drawShuffle.bind(this));
        this.eventBus.on(C.DRAW_UNSHUFLE, this.drawUnshuffle.bind(this));
        this.eventBus.on(C.DRAW_REPEAT, this.drawRepeat.bind(this));
        this.eventBus.on(C.DRAW_REPEAT_ONE, this.drawRepeatOne.bind(this));
        this.eventBus.on(C.DRAW_UNREPEAT, this.drawUnrepeat.bind(this));
        this.eventBus.on(C.DRAW_MUTE, this.drawMute.bind(this));
        this.eventBus.on(C.DRAW_UNMUTE, this.drawUnmute.bind(this));
        this.eventBus.emit(C.GET_TRACKS, {});
    }
    /**
     * Позиционирует плеер
     */
    render() {
        const body = document.getElementsByTagName('body')[0];
        const left = (
            this.expanded ?
                body.clientWidth - document.getElementsByClassName('main-pos')[0].clientWidth :
                body.clientWidth - 13
        );
        document.getElementsByClassName('main-pos')[0].style.left = left.toString() + 'px';
        const navbar = document.getElementsByClassName('navbar')[0];
        const top = (navbar === undefined ? 0 : navbar.clientHeight);
        const height = (
            navbar === undefined ?
                document.documentElement.clientHeight :
                document.documentElement.clientHeight - navbar.clientHeight
        );
        document.getElementsByTagName('audio')[0].volume = this.volume;
        this.drawVolume(height);
        document.getElementsByClassName('main-pos')[0].style.top = top.toString() + 'px';
        document.getElementsByClassName('main-pos')[0].style.height = height.toString() + 'px';
        document.getElementsByClassName('player-trigger')[0]
            .style.height = height.toString() + 'px';
        this.drawVolume(document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height * this.volume);
    }
    /**
     * Sets EventListeners
     */
    setEventListeners() {
        window.addEventListener('resize', this.render.bind(this));
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
        document.querySelectorAll('.track-list .row').forEach((row) => {
            row.onmouseover = (event) => console.log(event);
        });
        // this.elements.addButtons.addEventListener();
        // this.elements.deleteButtons.addEventListener();
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
        this.eventBus.emit('next', 'self');
    }
    /**
     * Слушает вход курсора на триггер плеера
     */
    triggerMouseOver() {
        document.getElementsByClassName('player-trigger-arrow')[0].style.visibility = 'visible';
    }
    /**
     * Слушает выход курсора с триггера плеера
     */
    triggerMouseOut() {
        document.getElementsByClassName('player-trigger-arrow')[0].style.visibility = 'hidden';
    }
    /**
     * Слушает клик мышью по триггеру плеера
     */
    triggerClick() {
        if (this.expanded) {
            document.getElementsByClassName('player-trigger-arrow')[0]
                .style.transform = 'rotate(180deg)';
            document.getElementsByClassName('player-trigger-arrow')[0].style.marginLeft = '-1px';
        } else {
            document.getElementsByClassName('player-trigger-arrow')[0]
                .style.transform = 'rotate(0)';
            document.getElementsByClassName('player-trigger-arrow')[0].style.marginLeft = '-3px';
        }
        const body = document.getElementsByTagName('body')[0];
        const left = (
            this.expanded ?
                body.clientWidth - 13 :
                body.clientWidth - document.getElementsByClassName('main-pos')[0].clientWidth
        );
        document.getElementsByClassName('main-pos')[0].style.left = left + 'px';
        this.expanded = !this.expanded;
    }
    /**
     * Слушает клик по кнопке воспроизвдения/паузы
     */
    playPauseButtonClick() {
        if (this.playing) {
            this.eventBus.emit(C.PAUSE, {});
        } else {
            this.eventBus.emit(C.PLAY, {});
        }
    }
    /**
     * Слушает клик по кнопке включения предыдущего трека
     */
    prevButtonClick() {
        this.eventBus.emit(C.PREVIOUS, {});
    }
    /**
     * Слушает клик по кнопке включения следующего трека
     */
    nextButtonClick() {
        this.eventBus.emit(C.NEXT, 'click');
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
        this.eventBus.emit(C.REWIND, ratio);
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
        this.eventBus.emit(C.REWIND, ratio);
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
            this.eventBus.emit(C.SHUFFLE, 'first');
        } else {
            this.eventBus.emit(C.UNSHUFFLE, {});
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
            this.eventBus.emit(C.REPEAT, {});
            break;
        case 1:
            this.eventBus.emit(C.REPEAT_ONE, {});
            break;
        case 2:
            this.eventBus.emit(C.UNREPEAT, {});
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
        document.getElementsByClassName('volume-scale')[0].style.top = '48px';
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
        document.getElementsByClassName('volume-scale')[0].style.top = '58px';
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
            this.eventBus.emit(C.UNMUTE, {});
        } else {
            this.eventBus.emit(C.MUTE, {});
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
            if (delta > 0 && trackList.getClientRects()[0].y +
                trackList.getClientRects()[0].height > document.documentElement.clientHeight ||
                delta < 0 && top < 0
            ) {
                if (delta > 0 && top - delta / 8 > 0) {
                    trackList.style.top = '0';
                } else {
                    trackList.style.top = (top - delta / 6).toString() + 'px';
                }
            }
        }
    }
    /**
     * Рисует кнопку воспроизвдения/паузы как плей для режима паузы
     * (воспроизвдение по нажатию)
     */
    drawPlay() {
        document.getElementsByClassName('play-pause')[0].src = 'static/img/play.svg';
        this.playing = false;
    }
    /**
     * Рисует кнопку воспроизвдения/паузы как пауза для режима плей
     * (пауза по нажатию)
     */
    drawPause() {
        document.getElementsByClassName('play-pause')[0].src = 'static/img/pause.svg';
        this.playing = true;
    }
    /**
     * Обновляет текущий воспроизводимый трек
     * @param {Object} track
     */
    updateTrack(track) {
        const temp = track.image;
        if (temp.split('/')[0] === 'static') {
            track.image = '/' + temp;
        }
        document.getElementById('cover').src = track.image;
        document.getElementById('artist').innerHTML = track.artist;
        document.getElementById('title').innerHTML = track.name;
        const minutes = Math.floor(track.duration / 60);
        const seconds = Math.floor(track.duration % 60);
        document.getElementsByClassName('duration')[0].innerHTML = minutes.toString() + ':' +
            (seconds < 10 ? '0' : '') + seconds.toString();
        document.getElementsByClassName('current-time')[0].innerHTML = '0:00';
    }
    /**
     * Рисует треки в плейлисте
     * @param {Object} tracks
     */
    drawTracklist(tracks) {
        for (let i = 0; i < tracks.length; i++) {
            const temp = tracks[i].image;
            if (temp.split('/')[0] === 'static') {
                tracks[i].image = '/' + temp;
            }
            document.getElementsByClassName('track-list')[0].innerHTML +=
                // eslint-disable-next-line no-undef
                nunjucks.render('../../../../views/templates/track.njk', tracks[i]);
        }
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
        document.getElementsByClassName('repeat')[0].src = 'static/img/repeat_one.svg';
        this.repeatState = 2;
    }
    /**
     * Рисует кнопку зацикливания в режиме одноразового проигрывания (неактивной)
     */
    drawUnrepeat() {
        document.getElementsByClassName('repeat')[0].src = 'static/img/repeat.svg';
        document.getElementsByClassName('repeat')[0].style.opacity = '0.4';
        this.repeatState = 0;
    }
    /**
     * Рисует кнопку громкости в беззучном режиме (без волн)
     */
    drawMute() {
        document.getElementsByClassName('volume')[0].src = 'static/img/volume_mute.svg';
        this.drawVolume(0);
        this.muted = true;
    }
    /**
     * Рисует кнопку громкости в режиме со звуком (с волнами)
     */
    drawUnmute() {
        if (this.volume <= 0.5) {
            document.getElementsByClassName('volume')[0].src = 'static/img/volume_down.svg';
        } else {
            document.getElementsByClassName('volume')[0].src = 'static/img/volume_up.svg';
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
