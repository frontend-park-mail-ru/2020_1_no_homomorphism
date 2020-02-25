export class PlayerView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.elements = {
            audio           : document.getElementsByTagName('audio')[0],
            trigger         : document.getElementsByClassName('player-trigger')[0],
            arrow           : document.getElementsByClassName('player-trigger-arrow')[0],
            player          : document.getElementsByClassName('main-pos')[0],
            cover           : document.getElementById('cover'),
            artist          : document.getElementById('artist'),
            title           : document.getElementById('title'),
            playPauseButton : document.getElementsByClassName('play-pause')[0],
            prevButton      : document.getElementById('prev'),
            nextButton      : document.getElementById('next'),
            timeline        : {
                zone        : document.getElementsByClassName('timeline')[0],
                back        : document.getElementsByClassName('timeline-back')[0],
                front       : document.getElementsByClassName('timeline-front')[0],
                drag        : false,
                currentTime : document.getElementsByClassName('current-time')[0],
                duration    : document.getElementsByClassName('duration')[0],
            },
            shuffleButton   : document.getElementsByClassName('shuffle')[0],
            repeatButton    : document.getElementsByClassName('repeat')[0],
            volume          : {
                button : document.getElementsByClassName('volume')[0],
                scale  : document.getElementsByClassName('volume-scale')[0],
                back   : document.getElementsByClassName('volume-scale-back')[0],
                front  : document.getElementsByClassName('volume-scale-front')[0],
            },
            //addButtons : document.getElementsByClassName('add-buttons'),
            //deleteButtons : document.getElementsByClassName('delete-buttons'),
        };
        this.playing = false;
        this.shuffled = false;
        this.repeatState = 0;
        this.muted = false;
        this.volume = 1;

        window.addEventListener('mouseup', this.windowMouseUp.bind(this));
        this.elements.audio.addEventListener('timeupdate', this.audioTimeUpdate.bind(this));
        this.elements.audio.addEventListener('ended', this.audioEnded.bind(this));
        this.elements.trigger.addEventListener('mouseover', this.triggerMouseOver.bind(this));
        this.elements.trigger.addEventListener('mouseout', this.triggerMouseOut.bind(this));
        this.elements.trigger.addEventListener('click', this.triggerClick.bind(this));
        this.elements.playPauseButton.addEventListener('click', this.playPauseButtonClick.bind(this));
        this.elements.prevButton.addEventListener('click', this.prevButtonClick.bind(this));
        this.elements.nextButton.addEventListener('click', this.nextButtonClick.bind(this));
        this.elements.timeline.zone.addEventListener('mouseover', this.timelineMouseOver.bind(this));
        this.elements.timeline.zone.addEventListener('mouseout', this.timelineMouseOut.bind(this));
        this.elements.timeline.back.addEventListener('mousedown', this.timelineMouseDown.bind(this));
        this.elements.timeline.back.addEventListener('mouseup', this.timelineMouseUp.bind(this));
        this.elements.timeline.front.addEventListener('mousedown', this.timelineMouseDown.bind(this));
        this.elements.timeline.front.addEventListener('mouseup', this.timelineMouseUp.bind(this));
        // Как это обойти?
        this.elements.timeline.back.onmousemove = (event) => {
            this.timelineMouseMove(event);
        };
        // Как это обойти?
        this.elements.timeline.front.onmousemove = (event) => {
            this.timelineMouseMove(event);
        };
        // Как это обойти?
        this.elements.timeline.back.onclick = (event) => {
            this.timelineClick(event);
        };
        // Как это обойти?
        this.elements.timeline.front.onclick = (event) => {
            this.timelineClick(event);
        };
        this.elements.shuffleButton.addEventListener('mouseover', this.shuffleButtonMouseOver.bind(this));
        this.elements.shuffleButton.addEventListener('mouseout', this.shuffleButtonMouseOut.bind(this));
        this.elements.shuffleButton.addEventListener('click', this.shuffleButtonClick.bind(this));
        this.elements.repeatButton.addEventListener('mouseover', this.repeatButtonMouseOver.bind(this));
        this.elements.repeatButton.addEventListener('mouseout', this.repeatButtonMouseOut.bind(this));
        this.elements.repeatButton.addEventListener('click', this.repeatButtonClick.bind(this));
        this.elements.volume.button.addEventListener('mouseover', this.volumeButtonMouseOver.bind(this));
        this.elements.volume.button.addEventListener('mouseout', this.volumeButtonMouseOut.bind(this));
        this.elements.volume.button.addEventListener('click', this.volumeButtonClick.bind(this));
        this.elements.volume.scale.addEventListener('mouseover', this.volumeButtonMouseOver.bind(this));
        this.elements.volume.scale.addEventListener('mouseout', this.volumeButtonMouseOut.bind(this));
        // Как это обойти?
        this.elements.volume.back.onclick = (event) => {
            this.volumeScaleClick(event);
        };
        // Как это обойти?
        this.elements.volume.front.onclick = (event) => {
            this.volumeScaleClick(event);
        };
        //this.elements.addButtons.addEventListener();
        //this.elements.deleteButtons.addEventListener();

        this.eventBus.on('draw play', this.drawPlay.bind(this));
        this.eventBus.on('draw pause', this.drawPause.bind(this));
        this.eventBus.on('track update', this.updateTrack.bind(this));
        this.eventBus.on('draw timeline', this.drawTimeline.bind(this));
        this.eventBus.on('draw shuffle', this.drawShuffle.bind(this));
        this.eventBus.on('draw unshuffle', this.drawUnshuffle.bind(this));
        this.eventBus.on('draw repeat', this.drawRepeat.bind(this));
        this.eventBus.on('draw repeat one', this.drawRepeatOne.bind(this));
        this.eventBus.on('draw unrepeat', this.drawUnrepeat.bind(this));
        this.eventBus.on('draw mute', this.drawMute.bind(this));
        this.eventBus.on('draw unmute', this.drawUnmute.bind(this));
    }

    render() {
        this.eventBus.emit('init', {});
        const body = document.getElementsByTagName('body')[0];
        //console.log(player);
        //console.log(body);
        const left = body.clientWidth - 13;
        //console.log(left);
        this.elements.player.style.left = left.toString() + 'px';
        //console.log(player.style.left);
        const navbar = document.getElementsByClassName('navbar')[0];
        //console.log(navbar);
        let top = 0;
        let height = document.documentElement.clientHeight;
        if (navbar !== undefined) {
            top = navbar.clientHeight;
            height -= navbar.clientHeight;
        }
        //console.log(top);
        //console.log(height);
        this.elements.player.style.top = top.toString() + 'px';
        this.elements.player.style.height = height.toString() + 'px';
        this.elements.trigger.style.height = height.toString() + 'px';
        //console.log(player.style.top);
        //console.log(player.style.height);
        //console.log(trigger.style.height);
        //console.log('topkek');
        this.drawVolume(this.elements.volume.back.getBoundingClientRect().height * this.volume);
    }

    windowMouseUp() {
        this.elements.timeline.drag = false;
    }
    audioTimeUpdate() {
        if (
            isNaN(this.elements.audio.currentTime / this.elements.audio.duration) ||
            this.elements.timeline.drag
        ) {
            return;
        }
        this.drawTimeline(this.elements.audio.currentTime / this.elements.audio.duration);
    }
    audioEnded() {
        this.eventBus.emit('next', 'self');
    }
    triggerMouseOver() {
        this.elements.arrow.style.visibility = 'visible';
    }
    triggerMouseOut() {
        this.elements.arrow.style.visibility = 'hidden';
    }
    triggerClick() {
        if (this.elements.arrow.style.transform == 'rotate(180deg)') {
            this.elements.arrow.style.transform = 'rotate(0)';
            this.elements.arrow.style.marginLeft = '-3px';
        } else {
            this.elements.arrow.style.transform = 'rotate(180deg)';
            this.elements.arrow.style.marginLeft = '-1px';
        }
        const body = document.getElementsByTagName('body')[0];
        let left = body.clientWidth - 13;
        if (this.elements.player.style.left == left.toString() + 'px') {
            left = left - this.elements.player.clientWidth + 13;
        }
        this.elements.player.style.left = left + 'px';
    }
    playPauseButtonClick() {
        if (this.playing) {
            this.eventBus.emit('pause', {});
        } else {
            this.eventBus.emit('play', {});
        }
    }
    prevButtonClick() {
        this.eventBus.emit('prev', {});
    }
    nextButtonClick() {
        this.eventBus.emit('next', 'click');
    }
    timelineMouseOver() {
        this.elements.timeline.currentTime.style.fontSize = '11px';
        this.elements.timeline.duration.style.fontSize = '11px';
    }
    timelineMouseOut() {
        this.elements.timeline.currentTime.style.fontSize = '0';
        this.elements.timeline.duration.style.fontSize = '0';
    }
    timelineMouseDown() {
        console.log('down');
        this.elements.timeline.drag = true;
    }
    timelineMouseUp() {
        console.log('up');
        this.elements.timeline.drag = false;
        const width = event.clientX - this.elements.timeline.back.getBoundingClientRect().x;
        const ratio = width / this.elements.timeline.back.getBoundingClientRect().width;
        this.eventBus.emit('rewind', ratio);
    }
    timelineMouseMove(event) {
        if (this.elements.timeline.drag) {
            console.log('move');
            const width = event.clientX - this.elements.timeline.back.getBoundingClientRect().x;
            const ratio = width / this.elements.timeline.back.getBoundingClientRect().width;
            this.drawTimeline(ratio);
        }
    }
    timelineClick(event) {
        const width = event.clientX - this.elements.timeline.back.getBoundingClientRect().x;
        const ratio = width / this.elements.timeline.back.getBoundingClientRect().width;
        this.eventBus.emit('rewind', ratio);
    }
    shuffleButtonMouseOver() {
        if (!this.shuffled) {
            this.elements.shuffleButton.style.opacity = '1';
        }
    }
    shuffleButtonMouseOut() {
        if (!this.shuffled) {
            this.elements.shuffleButton.style.opacity = '0.4';
        }
    }
    shuffleButtonClick() {
        if (!this.shuffled) {
            this.eventBus.emit('shuffle', 'first');
        } else {
            this.eventBus.emit('unshuffle', {});
        }
    }
    repeatButtonMouseOver() {
        if (this.repeatState === 0) {
            this.elements.repeatButton.style.opacity = '1';
        }
    }
    repeatButtonMouseOut() {
        if (this.repeatState === 0) {
            this.elements.repeatButton.style.opacity = '0.4';
        }
    }
    repeatButtonClick() {
        switch (this.repeatState) {
            case 0:
                this.eventBus.emit('repeat', {});
                break;
            case 1:
                this.eventBus.emit('repeat one', {});
                break;
            case 2:
                this.eventBus.emit('unrepeat', {});
                break;
        }
    }
    volumeButtonMouseOver() {
        this.elements.volume.scale.style.transitionProperty = 'opacity, top';
        this.elements.volume.scale.style.visibility = 'visible';
        this.elements.volume.scale.style.opacity = '1';
        this.elements.volume.scale.style.top = '48px';
        this.elements.volume.button.style.opacity = '1';
    }
    volumeButtonMouseOut() {
        this.elements.volume.scale.style.transitionProperty = 'opacity, visibility, top';
        this.elements.volume.scale.style.visibility = 'hidden';
        this.elements.volume.scale.style.opacity = '0';
        this.elements.volume.scale.style.top = '58px';
        this.elements.volume.button.style.opacity = '0.4';
    }
    volumeButtonClick() {
        if (this.muted) {
            this.eventBus.emit('unmute', {});
        } else {
            this.eventBus.emit('mute', {});
        }
    }
    volumeScaleClick(event) {
        const height = this.elements.volume.back.getBoundingClientRect().height - (event.clientY - this.elements.volume.back.getBoundingClientRect().y);
        this.volume = height / this.elements.volume.back.getBoundingClientRect().height;
        this.elements.audio.volume = this.volume;
        this.drawVolume(height);
    }

    drawPlay() {
        this.elements.playPauseButton.src = '/img/play.svg';
        this.playing = false;
    }
    drawPause() {
        this.elements.playPauseButton.src = '/img/pause.svg';
        this.playing = true;
    }
    updateTrack(track) {
        this.elements.cover.src = track.cover;
        this.elements.artist.innerHTML = track.artist;
        this.elements.title.innerHTML = track.title;
        const minutes = Math.floor(track.duration / 60);
        const seconds = Math.floor(track.duration % 60);
        this.elements.timeline.duration.innerHTML = minutes.toString() + ':' + (seconds < 10 ? '0' : '') + seconds.toString();
        this.elements.timeline.currentTime.innerHTML = '0:00';
    }
    drawTimeline(ratio) {
        const width = ratio * this.elements.timeline.back.getBoundingClientRect().width;
        this.elements.timeline.front.style.width = width.toString() + 'px';
        const minutes = Math.floor((ratio * this.elements.audio.duration) / 60);
        const seconds = Math.floor((ratio * this.elements.audio.duration) % 60);
        this.elements.timeline.currentTime.innerHTML = minutes.toString() + ':' + (seconds < 10 ? '0' : '') + seconds.toString();
    }
    drawShuffle() {
        this.elements.shuffleButton.style.opacity = '1';
        this.shuffled = true;
    }
    drawUnshuffle() {
        this.elements.shuffleButton.style.opacity = '0.4';
        this.shuffled = false;
    }
    drawRepeat() {
        this.elements.repeatButton.style.opacity = '1';
        this.repeatState = 1;
    }
    drawRepeatOne() {
        this.elements.repeatButton.src = '/img/repeat_one.svg';
        this.repeatState = 2;
    }
    drawUnrepeat() {
        this.elements.repeatButton.src = '/img/repeat.svg';
        this.elements.repeatButton.style.opacity = '0.4';
        this.repeatState = 0;
    }
    drawMute() {
        this.elements.volume.button.src = '/img/volume_mute.svg';
        this.drawVolume(0);
        this.muted = true;
    }
    drawUnmute() {
        if (this.volume <= 0.5) {
            this.elements.volume.button.src = '/img/volume_down.svg';
        } else {
            this.elements.volume.button.src = '/img/volume_up.svg';
        }
        this.drawVolume(this.elements.volume.back.getBoundingClientRect().height * this.volume);
        this.muted = false;
    }
    drawVolume(height) {
        if (height === 0) {
            this.elements.volume.front.style.height = '0';
            return;
        }
        this.elements.volume.front.style.top = 0 - height.toString() + 'px';
        this.elements.volume.front.style.height = height.toString() + 'px';
    }
}
