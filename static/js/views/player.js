export class PlayerView {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;

        elements.playPauseButton.addEventListener('click', () => {
            if (elements.playPauseButton.src == '/img/play.svg') {
                eventBus.emit('play', {});
            } else {
                eventBus.emit('pause', {});
            }
        });
        elements.nextButton.addEventListener('click', () => {
            eventBus.emit('next', {});
        });
        elements.prevButton.addEventListener('click', () => {
            eventBus.emit('prev', {});
        });
        //elements.timeline.addEventListener();
        //elements.volume.addEventListener();
        elements.mixButton.addEventListener('click', () => {
            if (elements.mixButton.src == '/img/mix.svg') {
                eventBus.emit('unmix', {});
            } else {
                eventBus.emit('mix', {});
            }
        });
        elements.loopButton.addEventListener('click', () => {
            if (elements.loopButton.src == '/img/loop.svg') {
                eventBus.emit('loop one', {});
            } else if (elements.loopButton.src == '/img/loopOne.svg') {
                eventBus.emit('unloop', {});
            } else {
                eventBus.emit('loop', {});
            }
        });
        //elements.addButtons.addEventListener();
        //elements.deleteButtons.addEventListener();

        eventBus.on('track update', track => this.trackUpdate(track));
        eventBus.on('pause draw', () => this.pause());
        eventBus.on('play draw', () => this.play());
        eventBus.on('mix draw', () => this.mix());
        eventBus.on('unmix draw', () => this.unmix());
        eventBus.on('loop draw', () => this.loop());
        eventBus.on('loop one draw', () => this.loopOne());
        eventBus.on('unloop draw', () => this.unloop());
    }

    trackUpdate(track) {
        this.elements.cover.src = track.cover;
        this.elements.artist.innerHTML = track.artist;
        this.elements.title.innerHTML = track.title;
    }
    pause() {
        this.elements..src = '/img/pause.svg';
    }
    play() {
        this.elements..src = '/img/play.svg';
    }
    mix() {
        this.elements..src = '/img/mix.svg';
    }
    unmix() {
        this.elements..src = '/img/unmix.svg';
    }
    loop() {
        this.elements..src = '/img/loop.svg';
    }
    loopOne() {
        this.elements..src = '/img/loopOne.svg';
    }
    unloop() {
        this.elements..src = '/img/unloop.svg';
    }
}
