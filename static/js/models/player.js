export class PlayerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            track     : {},
            queue     : [],
            shuffle   : false,
            repeat    : false,
            repeatOne : false,
            mute      : false,
            volume    : 1,
        };

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

    pause() {
        //...
        this.eventBus.emit('draw play', {});
    }
    play() {
        //...
        this.eventBus.emit('draw pause', {});
    }
    prev() {
        //...
        this.eventBus.emit('track update', track);
    }
    next() {
        //...
        this.eventBus.emit('track update', track);
    }
    rewind(ratio) {
        //...
        this.eventBus.emit('draw timeline', ratio);
    }
    shuffle() {
        //...
        this.eventBus.emit('draw shuffle', {});
    }
    unshuffle() {
        //...
        this.eventBus.emit('draw unshuffle', {});
    }
    repeat() {
        //...
        this.eventBus.emit('draw repeat', {});
    }
    repeatOne() {
        //...
        this.eventBus.emit('draw repeat one', {});
    }
    unrepeat() {
        //...
        this.eventBus.emit('draw unrepeat', {});
    }
    mute() {
        //...
        this.eventBus.emit('draw mute', {});
    }
    unmute() {
        //...
        this.eventBus.emit('draw unmute', {});
    }
}
