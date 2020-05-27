import {PLAYER} from '@libs/constants';
import template from '@components/player_control/player_control.tmpl.xml';

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
        this.timelineDown = false;
        this.volumeDrag = false;
        this.eventBus = eventBus;
        this.subscribe();
    }

    /**
     * Подписка на события eventBus
     */
    subscribe() {
        [{
            event: PLAYER.TRACK_UPDATE,
            callback: this.updateTrack,
        }, {
            event: PLAYER.DRAW_PLAY,
            callback: this.drawPlay,
        }, {
            event: PLAYER.DRAW_PAUSE,
            callback: this.drawPause,
        }, {
            event: PLAYER.DRAW_TIMELINE,
            callback: this.drawTimeline,
        }, {
            event: PLAYER.DRAW_SHUFFLE,
            callback: this.drawShuffle,
        }, {
            event: PLAYER.DRAW_UNSHUFLE,
            callback: this.drawUnshuffle,
        }, {
            event: PLAYER.DRAW_REPEAT,
            callback: this.drawRepeat,
        }, {
            event: PLAYER.DRAW_REPEAT_ONE,
            callback: this.drawRepeatOne,
        }, {
            event: PLAYER.DRAW_UNREPEAT,
            callback: this.drawUnrepeat,
        }, {
            event: PLAYER.DRAW_MUTE,
            callback: this.drawMute,
        }, {
            event: PLAYER.DRAW_UNMUTE,
            callback: this.drawUnmute,
        }].forEach((subscription) => {
            this.eventBus.on(subscription.event, subscription.callback.bind(this));
        });
    }

    /**
     * Рендер
     */
    render() {
        document.getElementsByClassName('container-audio')[0].innerHTML = template();
        this.drawVolume(document.getElementsByClassName('volume-scale-back')[0]
            .getBoundingClientRect().height * this.volume);
        document.getElementsByTagName('audio')[0].volume = this.volume;
    }

    /**
     * Sets EventListeners
     */
    setEventListeners() {
        document.getElementsByClassName('player-control-button').forEach((button) => {
            button.addEventListener('touchstart', (event) => {
                event.preventDefault();
                event.target.classList.add('touched');
            });
            button.addEventListener('touchend', (event) => {
                event.preventDefault();
                event.target.classList.remove('touched');
                event.target.click();
            });
        });
        document.getElementsByClassName('playlist-control-button').forEach((button) => {
            button.addEventListener('touchstart', (event) => {
                event.preventDefault();
            });
            button.addEventListener('touchend', (event) => {
                event.preventDefault();
                event.target.click();
            });
        });
        [{
            element: window,
            event: 'mouseup',
            callback: this.windowMouseUp,
        }, {
            element: document.querySelector('.play-pause'),
            event: 'click',
            callback: this.playPauseButtonClick,
        }, {
            element: document.getElementById('prev'),
            event: 'click',
            callback: this.prevButtonClick,
        }, {
            element: document.getElementById('next'),
            event: 'click',
            callback: this.nextButtonClick,
        }, {
            element: document.querySelector('.timeline'),
            event: 'mouseover',
            callback: this.timelineMouseOver,
        }, {
            element: document.querySelector('.timeline'),
            event: 'mouseout',
            callback: this.timelineMouseOut,
        }, {
            element: document.querySelector('.timeline-back'),
            event: 'mousedown',
            callback: this.timelineMouseDown,
        }, {
            element: document.querySelector('.timeline-front'),
            event: 'mousedown',
            callback: this.timelineMouseDown,
        }, {
            element: document.querySelector('.timeline-toggler'),
            event: 'mousedown',
            callback: this.timelineMouseDown,
        }, {
            element: document.querySelector('.timeline-back'),
            event: 'mouseup',
            callback: this.timelineMouseUp,
        }, {
            element: document.querySelector('.timeline-front'),
            event: 'mouseup',
            callback: this.timelineMouseUp,
        }, {
            element: document.querySelector('.timeline-toggler'),
            event: 'mouseup',
            callback: this.timelineMouseUp,
        }, {
            element: window,
            event: 'mousemove',
            callback: this.timelineMouseMove,
        }, {
            element: document.querySelector('.shuffle'),
            event: 'click',
            callback: this.shuffleButtonClick,
        }, {
            element: document.querySelector('.repeat'),
            event: 'click',
            callback: this.repeatButtonClick,
        }, {
            element: document.querySelector('.volume'),
            event: 'mouseover',
            callback: this.volumeButtonMouseOver,
        }, {
            element: document.querySelector('.volume'),
            event: 'mouseout',
            callback: this.volumeButtonMouseOut,
        }, {
            element: document.querySelector('.volume'),
            event: 'click',
            callback: this.volumeButtonClick,
        }, {
            element: document.querySelector('.volume-scale'),
            event: 'mouseover',
            callback: this.volumeButtonMouseOver,
        }, {
            element: document.querySelector('.volume-scale'),
            event: 'mouseout',
            callback: this.volumeButtonMouseOut,
        }, {
            element: document.querySelector('.volume-scale-back'),
            event: 'mousedown',
            callback: this.volumeMouseDown,
        }, {
            element: document.querySelector('.volume-scale-back'),
            event: 'mouseup',
            callback: this.volumeMouseUp,
        }, {
            element: document.querySelector('.volume-scale-front'),
            event: 'mousedown',
            callback: this.volumeMouseDown,
        }, {
            element: document.querySelector('.volume-scale-front'),
            event: 'mouseup',
            callback: this.volumeMouseUp,
        }, {
            element: document.querySelector('.volume-scale-back'),
            event: 'click',
            callback: this.volumeScaleClick,
        }, {
            element: document.querySelector('.volume-scale-front'),
            event: 'click',
            callback: this.volumeScaleClick,
        }, {
            element: document.querySelector('.volume-scale-back'),
            event: 'mousemove',
            callback: this.volumeMouseMove,
        }, {
            element: document.querySelector('.volume-scale-front'),
            event: 'mousemove',
            callback: this.volumeMouseMove,
        }].forEach((el) => {
            el.element.addEventListener(el.event, el.callback.bind(this));
        });
        [{
            element: document.querySelector('.timeline-back'),
            event: 'touchstart',
            callback: this.timelineMouseDown,
        }, {
            element: document.querySelector('.timeline-front'),
            event: 'touchstart',
            callback: this.timelineMouseDown,
        }, {
            element: document.querySelector('.timeline-toggler'),
            event: 'touchstart',
            callback: this.timelineMouseDown,
        }].forEach((el) => {
            el.element.addEventListener(el.event, el.callback.bind(this));
        });
        document.querySelector('.timeline.row').addEventListener('touchmove',
            this.timelineMouseMove.bind(this));
        document.querySelector('.timeline.row').addEventListener('touchend',
            this.timelineTouchEnd.bind(this));
    }

    /**
     * Слушает отпускание клавиши мыши
     */
    windowMouseUp() {
        this.timelineDrag = false;
        this.timelineDown = false;
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
        document.querySelector('.current-time').classList.add('is-timeline-mouse-over');
        document.querySelector('.duration').classList.add('is-timeline-mouse-over');
    }

    /**
     * Слушает выход курсора из зоны таймлайна
     */
    timelineMouseOut() {
        document.querySelector('.current-time').classList.remove('is-timeline-mouse-over');
        document.querySelector('.duration').classList.remove('is-timeline-mouse-over');
    }

    /**
     * Слушает нажатие клавиши мыши на таймлайне
     */
    timelineMouseDown() {
        this.timelineDown = true;
    }

    /**
     * Слушает отпускание клавиши мыши на таймлайне
     * @param {Object} event
     */
    timelineMouseUp(event) {
        if (this.timelineDrag) {
            this.timelineDrag = false;
            const bcr = document.getElementsByClassName('timeline-back')[0].getBoundingClientRect();
            const width = event.clientX;
            const ratio = (width - bcr.x) / bcr.width;
            this.eventBus.emit(PLAYER.REWIND, ratio);
        } else {
            const bcr = document.getElementsByClassName('timeline-back')[0].getBoundingClientRect();
            const ratio = (event.clientX - bcr.x) / bcr.width;
            this.eventBus.emit(PLAYER.REWIND, ratio);
        }
    }

    /**
     * Слушает движение мыши по таймлайну
     * @param {Object} event
     */
    timelineMouseMove(event) {
        if (this.timelineDown && event.clientX) {
            this.timelineDrag = true;
            const bcr = document.getElementsByClassName('timeline-back')[0].getBoundingClientRect();
            const width = event.clientX;
            const ratio = (width - bcr.x) / bcr.width;
            this.drawTimeline(ratio, 'drag');
        } else if (event.changedTouches) {
            const bcr = document.getElementsByClassName('timeline-back')[0].getBoundingClientRect();
            const width = event.changedTouches[0].clientX;
            const ratio = (width - bcr.x) / bcr.width;
            this.drawTimeline(ratio, 'drag');
            if (event.cancelable) {
                event.preventDefault();
            }
        }
    }

    /**
     * Слушает клик по таймлайну
     * @param {Object} event
     */
    timelineTouchEnd(event) {
        this.timelineDown = false;
        const bcr = document.getElementsByClassName('timeline-back')[0].getBoundingClientRect();
        const ratio = (event.changedTouches[0].clientX - bcr.x) / bcr.width;
        this.eventBus.emit(PLAYER.REWIND, ratio);
        if (event.cancelable) {
            event.preventDefault();
        }
    }

    /**
     * Слушает клик по кнопке перемешивания
     */
    shuffleButtonClick() {
        document.querySelector('.shuffle').classList.toggle('is-opacity-1');
        if (!this.shuffled) {
            this.eventBus.emit(PLAYER.SHUFFLE, 'first');
        } else {
            this.eventBus.emit(PLAYER.UNSHUFFLE);
        }
    }

    /**
     * Слушает клик по кнопке зацикливания
     */
    repeatButtonClick() {
        switch (this.repeatState) {
        case 0:
            document.querySelector('.repeat').classList.add('is-opacity-1');
            this.eventBus.emit(PLAYER.REPEAT);
            break;
        case 1:
            this.eventBus.emit(PLAYER.REPEAT_ONE);
            break;
        case 2:
            document.querySelector('.repeat').classList.remove('is-opacity-1');
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
        document.getElementsByClassName('volume-scale')[0].classList.remove('is-not-displayed');
        document.querySelector('.volume-scale').classList.add('is-opacity-1');
        document.querySelector('.volume-scale').classList.add('is-volume-scale-hover');
        document.querySelector('.volume').classList.add('is-opacity-1');
    }

    /**
     * Слушает выход курсора с кнопки громкости
     */
    volumeButtonMouseOut() {
        document.getElementsByClassName('volume-scale')[0]
            .style.transitionProperty = 'opacity, visibility, top';
        document.getElementsByClassName('volume-scale')[0].classList.add('is-not-displayed');
        document.querySelector('.volume-scale').classList.remove('is-opacity-1');
        document.querySelector('.volume-scale').classList.remove('is-volume-scale-hover');
        document.querySelector('.volume').classList.remove('is-opacity-1');
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
        document.getElementsByClassName('play-pause')[0].src = '/static/img/icons/play.svg';
        this.playing = false;
    }

    /**
     * Рисует кнопку воспроизвдения/паузы как пауза для режима плей
     * (пауза по нажатию)
     */
    drawPause() {
        document.getElementsByClassName('play-pause')[0].src = '/static/img/icons/pause.svg';
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
     * @param {string} cause
     */
    drawTimeline(ratio, cause) {
        if (this.timelineDown && cause === 'timeChange') {
            return;
        }
        const width = ratio * document.getElementsByClassName('timeline-back')[0]
            .getBoundingClientRect().width;
        document.getElementsByClassName('timeline-front')[0].style.width = width.toString() + 'px';
        document.getElementsByClassName('timeline-toggler')[0].style.left =
            (width - 9).toString() + 'px';
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
        this.shuffled = true;
    }

    /**
     * Рисует кнопку перемешивания в режиме воспроизвдения подряд (неактивной)
     */
    drawUnshuffle() {
        this.shuffled = false;
    }

    /**
     * Рисует кнопку зацикливания в режиме зацикливания всего плейлиста (активной, пустой внутри)
     */
    drawRepeat() {
        this.repeatState = 1;
    }

    /**
     * Рисует кнопку зацикливания в режиме зацикливания одного трека (активной, с единичкой внутри)
     */
    drawRepeatOne() {
        document.getElementsByClassName('repeat')[0].src = '/static/img/icons/repeat_one.svg';
        this.repeatState = 2;
    }

    /**
     * Рисует кнопку зацикливания в режиме одноразового проигрывания (неактивной)
     */
    drawUnrepeat() {
        document.getElementsByClassName('repeat')[0].src = '/static/img/icons/repeat.svg';
        this.repeatState = 0;
    }

    /**
     * Рисует кнопку громкости в беззучном режиме (без волн)
     */
    drawMute() {
        document.getElementsByClassName('volume')[0].src = '/static/img/icons/volume_mute.svg';
        this.drawVolume(0);
        this.muted = true;
    }

    /**
     * Рисует кнопку громкости в режиме со звуком (с волнами)
     */
    drawUnmute() {
        if (this.volume <= 0.5) {
            document.getElementsByClassName('volume')[0].src = '/static/img/icons/volume_down.svg';
        } else {
            document.getElementsByClassName('volume')[0].src = '/static/img/icons/volume_up.svg';
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
