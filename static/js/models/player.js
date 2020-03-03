import {Api} from "../modules/api.js";

/**
 * Модель плеера
 */
export class PlayerModel {
    /**
     * Конструктор
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            queue    : [],
            playlist : [],
            current  : 0,
            playing  : false,
            shuffle  : false,
            repeat   : false,
        };
    }

    /**
     * рисует кнопочку логаута
     */
    logout() {
        Api.logoutFetch();
        document.getElementById('login-link').style.display = 'block';
        document.getElementById('signup-link').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('profile-link').style.display = 'none';
    }

    /**
     * достает первый трек в листе
     */
    getFirst() {
        Api.trackFetch('12344')
            .then(response => response.text())
            .then(data => {
                const track = JSON.parse(data);
                document.getElementsByTagName('audio')[0].children[0].src = track.link;
                document.getElementsByTagName('audio')[0].load();
                this.data.playlist.push(track);
                this.data.queue.push(this.data.playlist.length - 1);
                this.eventBus.emit('track update', track);
            });
        for (let i = 12345; i < 12350; i++) {
            Api.trackFetch(i.toString())
                .then(response => response.text())
                .then(data => {
                    const track = JSON.parse(data);
                    this.data.playlist.push(track);
                    this.data.queue.push(this.data.playlist.length - 1);
                })
                .then(() => {
                    if (this.data.playlist.length === 6) {
                        this.eventBus.emit('draw tracklist', this.data.playlist);
                    }
                });
        }
    }
    /**
     * останавливает воспроизведение
     */
    pause() {
        document.getElementsByTagName('audio')[0].pause();
        this.data.playing = false;
        this.eventBus.emit('draw play', {});
    }

    /**
     * начинает воспроизведение
     */
    play() {
        document.getElementsByTagName('audio')[0].play();
        this.data.playing = true;
        this.eventBus.emit('draw pause', {});
    }

    /**
     * переключает трек на предыдущий
     */
    prev() {
        if (this.data.current === 0) {
            if (this.data.repeat) {
                this.data.current = this.data.queue.length;
            } else {
                this.data.playing = false;
                return;
            }
        }
        this.data.current--;
        document.getElementsByTagName('audio')[0].children[0].src = this.data.playlist[this.data.queue[this.data.current]].link;
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].load();
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
        this.eventBus.emit('draw timeline', 0);
        this.eventBus.emit('track update', this.data.playlist[this.data.queue[this.data.current]]);
    }

    /**
     * переключает трек на следующий
     * @param cause {string}
     */
    next(cause) {
        if (this.data.current === this.data.queue.length - 1) {
            if (this.data.repeat) {
                if (this.data.shuffle) {
                    this.shuffle('random');
                }
                this.data.current = -1;
            } else {
                if (cause === 'self') {
                    this.eventBus.emit('draw play', {});
                    this.data.current = 0;
                    this.eventBus.emit('draw timeline', 0);
                    this.eventBus.emit('track update', this.data.playlist[this.data.queue[0]]);
                }
                this.data.playing = false;
                return;
            }
        }
        this.data.current++;
        document.getElementsByTagName('audio')[0].children[0].src = this.data.playlist[this.data.queue[this.data.current]].link;
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].load();
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
        this.eventBus.emit('draw timeline', 0);
        this.eventBus.emit('track update', this.data.playlist[this.data.queue[this.data.current]]);
    }

    /**
     * перематывает  композицию
     * @param ratio
     */
    rewind(ratio) {
        document.getElementsByTagName('audio')[0].currentTime = document.getElementsByTagName('audio')[0].duration * ratio;
        this.eventBus.emit('draw timeline', ratio);
    }
    shuffle(positionOfCurrent) {
        let j, tmp;
        for (let i = this.data.queue.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            if (j === this.data.current) {
                this.data.current = i;
            } else if (i === this.data.current) {
                this.data.current = j;
            }
            tmp = this.data.queue[j];
            this.data.queue[j] = this.data.queue[i];
            this.data.queue[i] = tmp;
        }
        if (positionOfCurrent === 'first') {
            tmp = this.data.queue[0];
            this.data.queue[0] = this.data.queue[this.data.current];
            this.data.queue[this.data.current] = tmp;
        }
        this.data.current = 0;
        this.data.shuffle = true;
        this.eventBus.emit('draw shuffle', {});
    }

    /**
     * шаффл выключен
     */
    unshuffle() {
        this.data.current = this.data.queue[this.data.current];
        this.data.queue.sort();
        this.data.shuffle = false;
        this.eventBus.emit('draw unshuffle', {});
    }

    /**
     * повторение листа
     */
    repeat() {
        this.data.repeat = true;
        this.eventBus.emit('draw repeat', {});
    }

    /**
     * повторение текущего трека
     */
    repeatOne() {
        this.data.repeat = false;
        document.getElementsByTagName('audio')[0].loop = true;
        this.eventBus.emit('draw repeat one', {});
    }

    /**
     * повторение отключено
     */
    unrepeat() {
        document.getElementsByTagName('audio')[0].loop = false;
        this.eventBus.emit('draw unrepeat', {});
    }

    /**
     * звук выключен
     */
    mute() {
        document.getElementsByTagName('audio')[0].muted = true;
        this.eventBus.emit('draw mute', {});
    }

    /**
     * звук включен
     */
    unmute() {
        document.getElementsByTagName('audio')[0].muted = false;
        this.eventBus.emit('draw unmute', {});
    }
}
