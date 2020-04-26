import {PLAYER} from '@libs/constans';
import template from '@components/player_control_component/player_control_component.tmpl.xml';

/**
 * Компонент - кнопки и таймлайн в плеере
 */
export default class PlayerControlComponent {
    /**
     * Конструткор
     * @param {Object} eventBus
     */
    constructor(eventBus) {
        this.playing = false;
        this.shuffled = false;
        this.repeatState = 0;
        this.muted = false;
        this.volume = 1;
        this.timelineDrag = false;
        this.volumeDrag = false;
        this.eventBus = eventBus;
        [
            [PLAYER.TRACK_UPDATE, this.updateTrack],
            [PLAYER.DRAW_PLAY, this.drawPlay],
            [PLAYER.DRAW_PAUSE, this.drawPause],
            [PLAYER.DRAW_TIMELINE, this.drawTimeline],
            [PLAYER.DRAW_SHUFFLE, this.drawShuffle],
            [PLAYER.DRAW_UNSHUFLE, this.drawUnshuffle],
            [PLAYER.DRAW_REPEAT, this.drawRepeat],
            [PLAYER.DRAW_REPEAT_ONE, this.drawRepeatOne],
            [PLAYER.DRAW_UNREPEAT, this.drawUnrepeat],
            [PLAYER.DRAW_MUTE, this.drawMute],
            [PLAYER.DRAW_UNMUTE, this.drawUnmute],
        ].forEach((subscription) => {
            this.eventBus.on(subscription[0], subscription[1].bind(this));
        });
    }

    /**
     * Рендер
     */
    render() {
        document.getElementsByClassName('container-audio')[0].innerHTML = template();
        this.drawVolume(document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height * this.volume);
    }

    /**
     * Sets EventListeners
     */
    setEventListeners() {
        [
            [window, 'mouseup', this.windowMouseUp],
            [document.querySelector('.play-pause'), 'click', this.playPauseButtonClick],
            [document.getElementById('prev'), 'click', this.prevButtonClick],
            [document.getElementById('next'), 'click', this.nextButtonClick],
            [document.querySelector('.timeline'), 'mouseover', this.timelineMouseOver],
            [document.querySelector('.timeline'), 'mouseout', this.timelineMouseOut],
            [document.querySelector('.timeline-back'), 'mousedown', this.timelineMouseDown],
            [document.querySelector('.timeline-front'), 'mousedown', this.timelineMouseDown],
            [document.querySelector('.timeline-back'), 'mouseup', this.timelineMouseUp],
            [document.querySelector('.timeline-front'), 'mouseup', this.timelineMouseUp],
            [document.querySelector('.timeline-back'), 'mousemove', this.timelineMouseMove],
            [document.querySelector('.timeline-front'), 'mousemove', this.timelineMouseMove],
            [document.querySelector('.timeline-back'), 'click', this.timelineClick],
            [document.querySelector('.timeline-front'), 'click', this.timelineClick],
            [document.querySelector('.shuffle'), 'mouseover', this.shuffleButtonMouseOver],
            [document.querySelector('.shuffle'), 'mouseout', this.shuffleButtonMouseOut],
            [document.querySelector('.shuffle'), 'click', this.shuffleButtonClick],
            [document.querySelector('.repeat'), 'mouseover', this.repeatButtonMouseOver],
            [document.querySelector('.repeat'), 'mouseout', this.repeatButtonMouseOut],
            [document.querySelector('.repeat'), 'click', this.repeatButtonClick],
            [document.querySelector('.volume'), 'mouseover', this.volumeButtonMouseOver],
            [document.querySelector('.volume'), 'mouseout', this.volumeButtonMouseOut],
            [document.querySelector('.volume'), 'click', this.volumeButtonClick],
            [document.querySelector('.volume-scale'), 'mouseover', this.volumeButtonMouseOver],
            [document.querySelector('.volume-scale'), 'mouseout', this.volumeButtonMouseOut],
            [document.querySelector('.volume-scale-back'), 'mousedown', this.volumeMouseDown],
            [document.querySelector('.volume-scale-back'), 'mouseup', this.volumeMouseUp],
            [document.querySelector('.volume-scale-front'), 'mousedown', this.volumeMouseDown],
            [document.querySelector('.volume-scale-front'), 'mouseup', this.volumeMouseUp],
            [document.querySelector('.volume-scale-back'), 'click', this.volumeScaleClick],
            [document.querySelector('.volume-scale-front'), 'click', this.volumeScaleClick],
            [document.querySelector('.volume-scale-back'), 'mousemove', this.volumeMouseMove],
            [document.querySelector('.volume-scale-front'), 'mousemove', this.volumeMouseMove],
        ].forEach((el) => {
            el[0].addEventListener(el[1], el[2].bind(this));
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
