import {Api} from "../modules/api.js";

export class PlayerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            current   : 0,
            playing   : false,
            shuffle   : false,
            repeat    : false,
        };

        this.eventBus.on('init', this.getFirst.bind(this));
        this.eventBus.on('pause', this.pause.bind(this));
        this.eventBus.on('play', this.play.bind(this));
        this.eventBus.on('prev', this.prev.bind(this));
        this.eventBus.on('next', this.next.bind(this));
        this.eventBus.on('rewind', this.rewind.bind(this));
        this.eventBus.on('shuffle', this.shuffle.bind(this));
        this.eventBus.on('unshuffle', this.unshuffle.bind(this));
        this.eventBus.on('repeat', this.repeat.bind(this));
        this.eventBus.on('repeat one', this.repeatOne.bind(this));
        this.eventBus.on('unrepeat', this.unrepeat.bind(this));
        this.eventBus.on('mute', this.mute.bind(this));
        this.eventBus.on('unmute', this.unmute.bind(this));
        //this.eventBus.on('volume up', this.volumeUp);
        //this.eventBus.on('volume down', this.volumeDown);
    }

    logout() {
        Api.logoutFetch();
    }

    getFirst() {
        Api.trackFetch('12344')
        .then(response => response.text())
        .then(data => {
            const track = JSON.parse(data);
            document.getElementsByTagName('audio')[0].children[0].src = track.link;
            document.getElementsByTagName('audio')[0].load();
            this.eventBus.emit('track update', track);
            this.data.playlist[0] = track;
        });
        console.log(this.data.playlist);
    }
    pause() {
        document.getElementsByTagName('audio')[0].pause();
        this.data.playing = false;
        this.eventBus.emit('draw play', {});
    }
    play() {
        document.getElementsByTagName('audio')[0].play();
        this.data.playing = true;
        this.eventBus.emit('draw pause', {});
    }
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
        document.getElementsByTagName('audio')[0].children[0].src = this.data.playlist[this.data.queue[this.data.current]].src;
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
        document.getElementsByTagName('audio')[0].children[0].src = this.data.playlist[this.data.queue[this.data.current]].src;
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
    unshuffle() {
        this.data.current = this.data.queue[this.data.current];
        this.data.queue.sort();
        this.data.shuffle = false;
        this.eventBus.emit('draw unshuffle', {});
    }
    repeat() {
        this.data.repeat = true;
        this.eventBus.emit('draw repeat', {});
    }
    repeatOne() {
        this.data.repeat = false;
        document.getElementsByTagName('audio')[0].loop = true;
        this.eventBus.emit('draw repeat one', {});
    }
    unrepeat() {
        document.getElementsByTagName('audio')[0].loop = false;
        this.eventBus.emit('draw unrepeat', {});
    }
    mute() {
        document.getElementsByTagName('audio')[0].muted = true;
        this.eventBus.emit('draw mute', {});
    }
    unmute() {
        document.getElementsByTagName('audio')[0].muted = false;
        this.eventBus.emit('draw unmute', {});
    }
}
