import Api from '@libs/api.js';
import {PLAYER, RESPONSE, GLOBAL} from '@libs/constans';

/**
 * Модель плеера
 */
export default class PlayerModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.queue = [];
        this.playlist = [];
        this.current = 0;
        this.playing = false;
        this.state = {
            shuffle: false,
            repeat: false,
        };
        this.globalEventBus.on(GLOBAL.CLEAR_AND_LOCK, this.deleteAll.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_ARTIST_TRACKS, this.deleteAll.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_ARTIST_TRACKS, this.getArtistTracks.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_ARTIST_TRACKS, this.play.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_PLAYLIST, this.deleteAll.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_PLAYLIST, this.getPlaylistTracks.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_PLAYLIST, this.play.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_ALBUM, this.deleteAll.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_ALBUM, this.getAlbumTracks.bind(this));
        this.globalEventBus.on(GLOBAL.PLAY_ALBUM, this.play.bind(this));
        this.eventBus.on(PLAYER.GET_TRACK, this.getTrack.bind(this));
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
        this.eventBus.on(PLAYER.DELETE, this.delete.bind(this));
    }

    /**
     * Получение треков артиста
     * @param {string} artistId
     * @param {string} trackId
     * @param {number} number
     */
    getArtistTracks(artistId, trackId, number) {
        Api.artistTracksFetch(artistId, '0', number.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.generateData.bind(this)(res, trackId);
                    break;
                case RESPONSE.BAD_REQUEST: // TODO
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получение треков плейлиста
     * @param {string} index
     */
    getPlaylistTracks(index) {
        Api.playlistTracksFetch(index.index)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.generateData.bind(this)(res);
                    break;
                case RESPONSE.BAD_REQUEST: // TODO Плейлиста не существует
                    break;
                case RESPONSE.UNAUTH: // TODO Пользователь не залогинен => дефолтный плейлист
                case RESPONSE.NO_ACCESS_RIGHT: // TODO Нет прав к этому плейлисту
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получение списка треков
     * @param {Object} album
     */
    getAlbumTracks(album) {
        Api.albumFetch(album.id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.generateData.bind(this)(res);
                    break;
                case RESPONSE.BAD_REQUEST: // TODO обработать ошибку
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * останавливает воспроизведение
     * @param {Object} res
     * @param {number} trackId
     */
    generateData(res, trackId = '') {
        res.json()
            .then((list) => {
                // eslint-disable-next-line guard-for-in
                for (const song in list.tracks) {
                    this.playlist.push(list.tracks[song]);
                    this.queue.push(this.playlist.length - 1);
                }
                if (trackId !== '') {
                    this.current = this.playlist.indexOf(this.playlist.find((track) =>
                        track.id === trackId));
                }
                this.eventBus.emit(PLAYER.DRAW_TRACKLIST, this.playlist);
                this.eventBus.emit(PLAYER.MOVE_MARKER, this.playlist[this.queue[this.current]].id,
                    this.playlist[this.queue[this.current]].id);
                this.getTrack(this.playlist[this.queue[this.current]].id);
            });
    }

    /**
     * достает трек
     * @param {string} id
     */
    getTrack(id) {
        const currentId = this.playlist[this.queue[this.current]].id;
        this.current = this.queue.indexOf(this.playlist.indexOf(
            this.playlist.find((track) => track.id === id)));
        document.getElementsByTagName('audio')[0].children[0].src =
            this.playlist[this.queue[this.current]].link;
        if (this.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].load();
        if (this.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
        this.eventBus.emit(PLAYER.DRAW_TIMELINE, 0);
        this.eventBus.emit(PLAYER.TRACK_UPDATE, this.playlist[this.queue[this.current]]);
        this.eventBus.emit(PLAYER.MOVE_MARKER, currentId,
            this.playlist[this.queue[this.current]].id);
    }

    /**
     * останавливает воспроизведение
     */
    pause() {
        document.getElementsByTagName('audio')[0].pause();
        this.playing = false;
        this.eventBus.emit(PLAYER.DRAW_PLAY);
    }

    /**
     * начинает воспроизведение
     */
    play() {
        document.getElementsByTagName('audio')[0].play();
        this.playing = true;
        this.eventBus.emit(PLAYER.DRAW_PAUSE);
    }

    /**
     * переключает трек на предыдущий
     */
    prev() {
        const currentId = this.playlist[this.queue[this.current]].id;
        if (this.current === 0) {
            if (this.state.repeat) {
                this.current = this.queue.length;
            } else {
                this.playing = false;
                return;
            }
        }
        this.current--;
        document.getElementsByTagName('audio')[0].children[0].src =
            this.playlist[this.queue[this.current]].link;
        if (this.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].load();
        if (this.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
        this.eventBus.emit(PLAYER.DRAW_TIMELINE, 0);
        this.eventBus.emit(PLAYER.TRACK_UPDATE, this.playlist[this.queue[this.current]]);
        this.eventBus.emit(PLAYER.MOVE_MARKER, currentId,
            this.playlist[this.queue[this.current]].id);
    }

    /**
     * переключает трек на следующий
     * @param {string} cause
     */
    next(cause) {
        const currentId = this.playlist[this.queue[this.current]].id;
        if (this.current === this.queue.length - 1) {
            if (this.state.repeat) {
                if (this.state.shuffle) {
                    this.shuffle('random');
                }
                this.current = -1;
            } else {
                if (cause === 'self') {
                    this.eventBus.emit(PLAYER.DRAW_PLAY);
                    this.current = 0;
                    this.eventBus.emit(PLAYER.DRAW_TIMELINE, 0);
                    this.eventBus.emit(PLAYER.TRACK_UPDATE, this.playlist[this.queue[0]]);
                    this.eventBus.emit(PLAYER.MOVE_MARKER, currentId,
                        this.playlist[this.queue[0]].id);
                }
                this.playing = false;
                return;
            }
        }
        this.current++;
        document.getElementsByTagName('audio')[0].children[0].src =
            this.playlist[this.queue[this.current]].link;
        if (this.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].load();
        if (this.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
        this.eventBus.emit(PLAYER.DRAW_TIMELINE, 0);
        this.eventBus.emit(PLAYER.TRACK_UPDATE, this.playlist[this.queue[this.current]]);
        if (cause === 'delete') {
            return;
        }
        this.eventBus.emit(PLAYER.MOVE_MARKER, currentId,
            this.playlist[this.queue[this.current]].id);
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
        for (let i = this.queue.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            if (j === this.current) {
                this.current = i;
            } else if (i === this.current) {
                this.current = j;
            }
            tmp = this.queue[j];
            this.queue[j] = this.queue[i];
            this.queue[i] = tmp;
        }
        if (positionOfCurrent === 'first') {
            tmp = this.queue[0];
            this.queue[0] = this.queue[this.current];
            this.queue[this.current] = tmp;
        }
        this.current = 0;
        this.state.shuffle = true;
        this.eventBus.emit(PLAYER.DRAW_SHUFFLE);
    }

    /**
     * шаффл выключен
     */
    unshuffle() {
        this.current = this.queue[this.current];
        this.queue.sort();
        this.state.shuffle = false;
        this.eventBus.emit(PLAYER.DRAW_UNSHUFLE);
    }

    /**
     * повторение листа
     */
    repeat() {
        this.state.repeat = true;
        this.eventBus.emit(PLAYER.DRAW_REPEAT);
    }

    /**
     * повторение текущего трека
     */
    repeatOne() {
        this.state.repeat = false;
        document.getElementsByTagName('audio')[0].loop = true;
        this.eventBus.emit(PLAYER.DRAW_REPEAT_ONE);
    }

    /**
     * повторение отключено
     */
    unrepeat() {
        document.getElementsByTagName('audio')[0].loop = false;
        this.eventBus.emit(PLAYER.DRAW_UNREPEAT);
    }

    /**
     * звук выключен
     */
    mute() {
        document.getElementsByTagName('audio')[0].muted = true;
        this.eventBus.emit(PLAYER.DRAW_MUTE);
    }

    /**
     * звук включен
     */
    unmute() {
        document.getElementsByTagName('audio')[0].muted = false;
        this.eventBus.emit(PLAYER.DRAW_UNMUTE);
    }

    /**
     * Удаляет трек из очереди
     * @param {string} id
     */
    delete(id) {
        let decCurrent = this.playlist.length !== 1 &&
            this.queue.indexOf(this.playlist.indexOf(this.playlist.find((track) =>
                track.id === id))) < this.current;
        if (this.playlist[this.queue[this.current]].id === id) {
            if (this.playlist.length === 1) {
                this.pause();
            } else {
                this.next('delete');
                decCurrent = true;
            }
        }
        const track = this.playlist.find((track) => track.id === id);
        if (decCurrent) {
            this.current--;
        }
        this.queue.splice(this.queue.indexOf(Math.max(this.queue)), 1);
        this.playlist.splice(this.playlist.indexOf(track), 1);
        this.eventBus.emit(PLAYER.REMOVE_FROM_TRACKLIST, id);
        if (this.tracklist.length === 0) {
            return;
        }
        this.eventBus.emit(PLAYER.MOVE_MARKER, this.playlist[this.queue[this.current]].id,
            this.playlist[this.queue[this.current]].id);
    }

    /**
     * Удаляет все треки из очереди
     */
    deleteAll() {
        if (this.playing) {
            this.pause();
        }
        this.queue = [];
        this.playlist = [];
        this.current = 0;
        this.eventBus.emit(PLAYER.REMOVE_FROM_TRACKLIST_ALL);
    }
}
