export class PlayerView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.elements = {
            cover  : document.getElementById('cover'),
            artist : document.getElementById('artist'),
            title  : document.getElementById('title'),
            //playPauseButton : document.getElementById('play-pause-button'),
            //nextButton : document.getElementById('next-button'),
            //prevButton : document.getElementById('prev-button'),
            //timeline : document.getElementById('timeline'),
            //volume : document.getElementById('volume'),
            //mixButton : document.getElementById('mix-button'),
            //loopButton : document.getElementById('loop-button'),
            //addButtons : document.getElementsByClassName('add-buttons'),
            //deleteButtons : document.getElementsByClassName('delete-buttons'),
        };

        this.elements.playPauseButton.addEventListener('click', this.playPauseButtonClick);
        this.elements.nextButton.addEventListener('click', this.nextButtonClick);
        this.elements.prevButton.addEventListener('click', this.prevButtonClick);
        //this.elements.timeline.addEventListener();
        //this.elements.volume.addEventListener();
        this.elements.mixButton.addEventListener('click', this.mixButtonClick);
        this.elements.loopButton.addEventListener('click', this.loopButtonClick);
        //this.elements.addButtons.addEventListener();
        //this.elements.deleteButtons.addEventListener();

        this.eventBus.on('track update', this.trackUpdate);
        this.eventBus.on('pause draw', this.pause);
        this.eventBus.on('play draw', this.play);
        this.eventBus.on('mix draw', this.mix);
        this.eventBus.on('unmix draw', this.unmix);
        this.eventBus.on('loop draw', this.loop);
        this.eventBus.on('loop one draw', this.loopOne);
        this.eventBus.on('unloop draw', this.unloop);
    }

    playPauseButtonClick() {
        if (this.elements.playPauseButton.src == '/img/play.svg') {
            this.eventBus.emit('play', {});
        } else {
            this.eventBus.emit('pause', {});
        }
    }
    nextButtonClick() {
        this.eventBus.emit('next', {});
    }
    prevButtonClick() {
        this.eventBus.emit('prev', {});
    }
    mixButtonClick() {
        if (this.elements.mixButton.src == '/img/mix.svg') {
            this.eventBus.emit('unmix', {});
        } else {
            this.eventBus.emit('mix', {});
        }
    }
    loopButtonClick() {
        if (this.elements.loopButton.src == '/img/loop.svg') {
            this.eventBus.emit('loop one', {});
        } else if (this.elements.loopButton.src == '/img/loopOne.svg') {
            this.eventBus.emit('unloop', {});
        } else {
            this.eventBus.emit('loop', {});
        }
    }

    trackUpdate(track) {
        this.elements.cover.src = track.cover;
        this.elements.artist.innerHTML = track.artist;
        this.elements.title.innerHTML = track.title;
    }
    pause() {
        this.elements.src = '/img/pause.svg';
    }
    play() {
        this.elements.src = '/img/play.svg';
    }
    mix() {
        this.elements.src = '/img/mix.svg';
    }
    unmix() {
        this.elements.src = '/img/unmix.svg';
    }
    loop() {
        this.elements.src = '/img/loop.svg';
    }
    loopOne() {
        this.elements.src = '/img/loopOne.svg';
    }
    unloop() {
        this.elements.src = '/img/unloop.svg';
    }
}
