export class PlayerModel {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;

        eventBus.on('next', () => this.next());
        eventBus.on('prev', () => this.prev());
        eventBus.on('play/pause', () => this.playPause());
        eventBus.on('mix', () => this.mix());
        eventBus.on('unmix', () => this.unmix());
        eventBus.on('loop', () => this.loop());
        eventBus.on('loop one', () => this.loopOne());
        eventBus.on('unloop', () => this.unloop());
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
