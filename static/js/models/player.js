export class PlayerModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            track   : {},
            queue   : [],
            mix     : false,
            loop    : false,
            loopOne : false,
        };

        this.eventBus.on('next', this.next);
        this.eventBus.on('prev', this.prev);
        this.eventBus.on('play/pause', this.playPause);
        this.eventBus.on('mix', this.mix);
        this.eventBus.on('unmix', this.unmix);
        this.eventBus.on('loop', this.loop);
        this.eventBus.on('loop one', this.loopOne);
        this.eventBus.on('unloop', this.unloop);
    }

    next() {
        //...
        this.eventBus.emit('track update', track);
    }
    prev() {
        //...
        this.eventBus.emit('track update', track);
    }
    playPause() {
        //...
        this.eventBus.emit('play draw', {});
        this.eventBus.emit('pause draw', {});
    }
    mix() {
        //...
        this.eventBus.emit('mix draw', {});
    }
    unmix() {
        //...
        this.eventBus.emit('unmix draw', {});
    }
    loop() {
        //...
        this.eventBus.emit('loop draw', {});
    }
    loopOne() {
        //...
        this.eventBus.emit('loop one draw', {});
    }
    unloop() {
        //...
        this.eventBus.emit('unloop draw', {});
    }
}
