import Api from '@libs/api.js';
import {PLAYER} from '@libs/constans.js';

/**
 * Модель плеера
 */
export default class PlayerModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            queue: [],
            playlist: [],
            current: 0,
            playing: false,
            shuffle: false,
            repeat: false,
        };
        this.eventBus.on(PLAYER.GET_TRACKS, this.getPlaylistTracks.bind(this));
        this.eventBus.on(PLAYER.PAUSE, this.pause.bind(this));
        this.eventBus.on(PLAYER.PLAY, this.play.bind(this));
        this.eventBus.on(PLAYER.PREVIOUS, this.prev.bind(this));
        this.eventBus.on(PLAYER.NEXT, this.next.bind(this));
        this.eventBus.on(PLAYER.REWIND, this.rewind.bind(this));
        this.eventBus.on(PLAYER.SHUFFLE, this.shuffle.bind(this));
        this.eventBus.on(PLAYER.UNSHUFFLE, this.unshuffle.bind(this));
        this.eventBus.on(PLAYER.REPEAT, this.repeat.bind(this));
        this.eventBus.on(PLAYER.REPEAT_ONE, this.repeatOne.bind(this));
        this.eventBus.on(PLAYER.UNREPEAT, this.unrepeat.bind(this));
        this.eventBus.on(PLAYER.MUTE, this.mute.bind(this));
        this.eventBus.on(PLAYER.UNMUTE, this.unmute.bind(this));
    }

    /**
     * Получение треков плейлиста
     */
    getPlaylistTracks(index) {
        Api.playlistTracksFetch(index.index)
            .then((response) => response.json())
            .then((list) => {
                // eslint-disable-next-line guard-for-in
                for (const song in list.tracks) {
                    this.data.playlist.push(list.tracks[song]);
                    this.data.queue.push(this.data.playlist.length - 1);
                }
                this.eventBus.emit(PLAYER.DRAW_TRACKLIST, this.data.playlist);
            });
    }

    /**
     * останавливает воспроизведение
     */
    pause() {
        document.getElementsByTagName('audio')[0].pause();
        this.data.playing = false;
        this.eventBus.emit(PLAYER.DRAW_PLAY, {});
    }

    /**
     * начинает воспроизведение
     */
    play() {
        document.getElementsByTagName('audio')[0].play(); // TODO обработать promise
        this.data.playing = true;
        this.eventBus.emit(PLAYER.DRAW_PAUSE, {});
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
        document.getElementsByTagName('audio')[0].children[0].src =
            this.data.playlist[this.data.queue[this.data.current]].link;
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].load();
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
        this.eventBus.emit(PLAYER.DRAW_TIMELINE, 0);
        this.eventBus.emit(PLAYER.TRACK_UPDATE,
            this.data.playlist[this.data.queue[this.data.current]]);
    }

    /**
     * переключает трек на следующий
     * @param {string} cause
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
                    this.eventBus.emit(PLAYER.DRAW_PLAY, {});
                    this.data.current = 0;
                    this.eventBus.emit(PLAYER.DRAW_TIMELINE, 0);
                    this.eventBus.emit(PLAYER.TRACK_UPDATE, this.data.playlist[this.data.queue[0]]);
                }
                this.data.playing = false;
                return;
            }
        }
        this.data.current++;
        document.getElementsByTagName('audio')[0].children[0].src =
            this.data.playlist[this.data.queue[this.data.current]].link;
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].load();
        if (this.data.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
        this.eventBus.emit(PLAYER.DRAW_TIMELINE, 0);
        this.eventBus.emit(PLAYER.TRACK_UPDATE,
            this.data.playlist[this.data.queue[this.data.current]]);
    }

    /**
     * перематывает  композицию
     * @param {number} ratio
     */
    rewind(ratio) {
        document.getElementsByTagName('audio')[0].currentTime =
            document.getElementsByTagName('audio')[0].duration * ratio;
        this.eventBus.emit(PLAYER.DRAW_TIMELINE, ratio);
    }

    /**
     * перемешать
     * @param {string} positionOfCurrent
     */
    shuffle(positionOfCurrent) {
        let j;
        let tmp;
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
        this.eventBus.emit(PLAYER.DRAW_SHUFFLE, {});
    }

    /**
     * шаффл выключен
     */
    unshuffle() {
        this.data.current = this.data.queue[this.data.current];
        this.data.queue.sort();
        this.data.shuffle = false;
        this.eventBus.emit(PLAYER.DRAW_UNSHUFLE, {});
    }

    /**
     * повторение листа
     */
    repeat() {
        this.data.repeat = true;
        this.eventBus.emit(PLAYER.DRAW_REPEAT, {});
    }

    /**
     * повторение текущего трека
     */
    repeatOne() {
        this.data.repeat = false;
        document.getElementsByTagName('audio')[0].loop = true;
        this.eventBus.emit(PLAYER.DRAW_REPEAT_ONE, {});
    }

    /**
     * повторение отключено
     */
    unrepeat() {
        document.getElementsByTagName('audio')[0].loop = false;
        this.eventBus.emit(PLAYER.DRAW_UNREPEAT, {});
    }

    /**
     * звук выключен
     */
    mute() {
        document.getElementsByTagName('audio')[0].muted = true;
        this.eventBus.emit(PLAYER.DRAW_MUTE, {});
    }

    /**
     * звук включен
     */
    unmute() {
        document.getElementsByTagName('audio')[0].muted = false;
        this.eventBus.emit(PLAYER.DRAW_UNMUTE, {});
    }
}
