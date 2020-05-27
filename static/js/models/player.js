import Api from '@libs/api';
import {PLAYER, RESPONSE, GLOBAL, PAGINATION} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';

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
        this.queue = [];
        this.playlist = [];
        this.current = 0;
        this.playing = false;
        this.state = {
            shuffle: false,
            repeat: false,
        };
        globalEventBus.on(GLOBAL.PAUSE, this.pause.bind(this));

        globalEventBus.on(GLOBAL.CLEAR_AND_LOCK, this.deleteAll.bind(this));
        globalEventBus.on(GLOBAL.PLAY_TRACKS, this.deleteAll.bind(this));
        globalEventBus.on(GLOBAL.PLAY_TRACKS, this.setData.bind(this));
        globalEventBus.on(GLOBAL.PLAY_ARTIST_TRACKS, this.deleteAll.bind(this));
        globalEventBus.on(GLOBAL.PLAY_ARTIST_TRACKS, this.getArtistTracks.bind(this));
        globalEventBus.on(GLOBAL.PLAY_PLAYLIST_TRACKS, this.deleteAll.bind(this));
        globalEventBus.on(GLOBAL.PLAY_PLAYLIST_TRACKS, this.getPlaylistTracks.bind(this));
        globalEventBus.on(GLOBAL.PLAY_ALBUM_TRACKS, this.deleteAll.bind(this));
        globalEventBus.on(GLOBAL.PLAY_ALBUM_TRACKS, this.getAlbumTracks.bind(this));
        globalEventBus.on(GLOBAL.PLAY_PLAYLIST, this.deleteAll.bind(this));
        globalEventBus.on(GLOBAL.PLAY_PLAYLIST, this.getPlaylistTracks.bind(this));
        globalEventBus.on(GLOBAL.PLAY_ALBUM, this.deleteAll.bind(this));
        globalEventBus.on(GLOBAL.PLAY_ALBUM, this.getAlbumTracks.bind(this));
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
        this.eventBus.on(PLAYER.CHANGE_ORDER, this.changeOrder.bind(this));
    }

    /**
     * Получение треков артиста
     * @param {string} artistId
     * @param {string} trackId
     * @param {number} number
     */
    getArtistTracks(artistId, trackId, number) {
        Api.artistTracksGet(artistId.toString(), '0', number.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.generateData.bind(this)(res, trackId);
                    break;
                case RESPONSE.BAD_REQUEST:
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получение треков плейлиста
     * @param {string} id
     * @param {string} trackId
     * @param {number} number
     */
    getPlaylistTracks(id, trackId, number = PAGINATION['tracks']) {
        Api.playlistTracksGet(id, '0', number.toString())
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.generateData.bind(this)(res, trackId);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * Получение списка треков
     * @param {string} id
     * @param {string} trackId
     * @param {number} number
     */
    getAlbumTracks(id, trackId, number = PAGINATION['tracks']) {
        Api.albumTracksGet(id, '0', number)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    this.generateData.bind(this)(res, trackId);
                    break;
                case RESPONSE.BAD_REQUEST:
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
     * @param {string} trackId
     */
    generateData(res, trackId = '') {
        res.json().then((list) => {
            this.setData.bind(this)(list, trackId);
        });
    }

    /**
     * Установка всех данных
     * @param {Object} list
     * @param {string} trackID
     */
    setData(list, trackID = '') {
        if (list.tracks.length === 0) {
            globalEventBus.emit(GLOBAL.CLEAR_AND_LOCK);
            return;
        }
        for (const song in list.tracks) {
            if ({}.hasOwnProperty.call(list.tracks, song)) {
                this.playlist.push(list.tracks[song]);
                this.queue.push(this.playlist.length - 1);
            }
        }
        if (trackID !== '') {
            this.current = this.playlist.indexOf(this.playlist.find((track) =>
                track.id === trackID));
        }
        this.eventBus.emit(PLAYER.DRAW_TRACKLIST, this.playlist);
        this.eventBus.emit(PLAYER.MOVE_MARKER, this.playlist[this.queue[this.current]].id,
            this.playlist[this.queue[this.current]].id);
        this.getTrack(this.playlist[this.queue[this.current]].id);
        this.play();
    }

    /**
     * достает трек
     * @param {string} id
     */
    getTrack(id) {
        this.playing = true;
        this.eventBus.emit(PLAYER.DRAW_PAUSE);
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
            localStorage.setItem('isPlaying', 'false');
            localStorage.setItem('isPlaying', 'true');
            document.getElementsByTagName('audio')[0].play();
            document.title = this.playlist[this.queue[this.current]].name + ' – ' +
                this.playlist[this.queue[this.current]].artist;
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
        document.title = 'VirusMusic';
    }

    /**
     * начинает воспроизведение
     */
    play() {
        localStorage.setItem('isPlaying', 'false');
        localStorage.setItem('isPlaying', 'true');
        document.getElementsByTagName('audio')[0].play()
            .then(() => {
                this.playing = true;
            });
        document.title = this.playlist[this.queue[this.current]].name + ' – ' +
            this.playlist[this.queue[this.current]].artist;
        this.eventBus.emit(PLAYER.DRAW_PAUSE);
    }

    /**
     * переключает трек на предыдущий
     */
    prev() {
        this.playing = true;
        this.eventBus.emit(PLAYER.DRAW_PAUSE);
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
            localStorage.setItem('isPlaying', 'false');
            localStorage.setItem('isPlaying', 'true');
            document.getElementsByTagName('audio')[0].play();
            document.title = this.playlist[this.queue[this.current]].name + ' – ' +
                this.playlist[this.queue[this.current]].artist;
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
        this.playing = true;
        this.eventBus.emit(PLAYER.DRAW_PAUSE);
        const currentId = this.playlist[this.queue[this.current]].id;
        if (this.current === this.queue.length - 1) {
            if (this.state.repeat) {
                if (this.state.shuffle) {
                    this.shuffle('random');
                }
                this.current = -1;
            } else {
                if (cause === 'self' || cause === 'delete') {
                    document.getElementsByTagName('audio')[0].pause();
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
            localStorage.setItem('isPlaying', 'false');
            localStorage.setItem('isPlaying', 'true');
            document.getElementsByTagName('audio')[0].play();
            document.title = this.playlist[this.queue[this.current]].name + ' – ' +
                this.playlist[this.queue[this.current]].artist;
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
        if (isNaN(document.getElementsByTagName('audio')[0].duration)) {
            return;
        }
        if (this.playing) {
            document.getElementsByTagName('audio')[0].pause();
        }
        document.getElementsByTagName('audio')[0].currentTime =
            document.getElementsByTagName('audio')[0].duration * ratio;
        if (this.playing) {
            document.getElementsByTagName('audio')[0].play();
        }
    }

    /**
     * перемешать
     * @param {string} positionOfCurrent
     */
    shuffle(positionOfCurrent) {
        let j;
        let tmp;
        for (let i = this.queue.length - 1; i > 0; i--) { // TODO подумать, как сделать с генераторами
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
     * Изменение порядка
     * @param {string} targetId
     * @param {string} setAfterId
     */
    changeOrder(targetId, setAfterId) {
        const temp = this.playlist.find((track) => track.id === targetId);
        this.playlist.splice(this.playlist.indexOf(temp), 1);
        const setAfter = this.playlist.find((track) => track.id === setAfterId);
        if (this.playlist.indexOf(setAfter) == this.playlist.length - 1) {
            this.playlist.push(temp);
        } else {
            this.playlist.splice(this.playlist.indexOf(setAfter) + 1, 0, temp);
        }
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
                document.title = 'VirusMusic';
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
        if (this.playlist.length === 0) {
            return;
        }
        this.eventBus.emit(PLAYER.MOVE_MARKER, this.playlist[this.queue[this.current]].id,
            this.playlist[this.queue[this.current]].id);
        this.eventBus.emit(PLAYER.MOVE_MARKER_TO_CURRENT);
    }

    /**
     * Удаляет все треки из очереди
     */
    deleteAll() {
        if (this.playing) {
            this.pause();
            document.title = 'VirusMusic';
        }
        this.queue = [];
        this.playlist = [];
        this.current = 0;
        this.eventBus.emit(PLAYER.REMOVE_FROM_TRACKLIST_ALL);
    }
}
