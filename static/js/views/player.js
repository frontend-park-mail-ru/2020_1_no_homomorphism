export class PlayerView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.timelineDrag = false;
        this.volumeDrag = false;
        this.playing = false;
        this.shuffled = false;
        this.repeatState = 0;
        this.muted = false;
        this.volume = 1;
        this.mode = 'additional';

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
        document.getElementById('logout-button').addEventListener('click', () => this.eventBus.emit('logout', {}));
    }

    render(root, mode) {
        this.mode = mode;
        const body = document.getElementsByTagName('body')[0];
        let left;
        switch (mode) {
            case 'additional':
                root.innerHTML += nunjucks.render('../../../views/templates/player.njk');
                left = body.clientWidth - 13;
                break;
            case 'main':
                root.innerHTML = nunjucks.render('../../../views/templates/player.njk');
                left = body.clientWidth / 2 - 200;
        }
        this.eventBus.emit('init', {});
        const navbar = document.getElementsByClassName('navbar')[0];
        let top = 0;
        let height = document.documentElement.clientHeight;
        if (navbar !== undefined) {
            top = navbar.clientHeight;
            height -= navbar.clientHeight;
        }
        document.getElementsByClassName('main-pos')[0].style.left = left.toString() + 'px';
        document.getElementsByTagName('audio')[0].volume = this.volume;
        this.drawVolume(height);
        document.getElementsByClassName('main-pos')[0].style.top = top.toString() + 'px';
        document.getElementsByClassName('main-pos')[0].style.height = height.toString() + 'px';
        document.getElementsByClassName('player-trigger')[0].style.height = height.toString() + 'px';
        this.drawVolume(document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height * this.volume);
        window.addEventListener('mouseup', this.windowMouseUp.bind(this));
        document.getElementsByTagName('audio')[0].addEventListener('timeupdate', this.audioTimeUpdate.bind(this));
        document.getElementsByTagName('audio')[0].addEventListener('ended', this.audioEnded.bind(this));
        document.getElementsByClassName('player-trigger')[0].addEventListener('mouseover', this.triggerMouseOver.bind(this));
        document.getElementsByClassName('player-trigger')[0].addEventListener('mouseout', this.triggerMouseOut.bind(this));
        document.getElementsByClassName('player-trigger')[0].addEventListener('click', this.triggerClick.bind(this));
        document.getElementsByClassName('play-pause')[0].addEventListener('click', this.playPauseButtonClick.bind(this));
        document.getElementById('prev').addEventListener('click', this.prevButtonClick.bind(this));
        document.getElementById('next').addEventListener('click', this.nextButtonClick.bind(this));
        document.getElementsByClassName('timeline')[0].addEventListener('mouseover', this.timelineMouseOver.bind(this));
        document.getElementsByClassName('timeline')[0].addEventListener('mouseout', this.timelineMouseOut.bind(this));
        document.getElementsByClassName('timeline-back')[0].addEventListener('mousedown', this.timelineMouseDown.bind(this));
        // Как это обойти?
        document.getElementsByClassName('timeline-back')[0].onmouseup = (event) => {
            this.timelineMouseUp(event);
        }
        document.getElementsByClassName('timeline-front')[0].addEventListener('mousedown', this.timelineMouseDown.bind(this));
        // Как это обойти?
        document.getElementsByClassName('timeline-front')[0].onmouseup = (event) => {
            this.timelineMouseUp(event);
        }
        // Как это обойти?
        document.getElementsByClassName('timeline-back')[0].onmousemove = (event) => {
            this.timelineMouseMove(event);
        };
        // Как это обойти?
        document.getElementsByClassName('timeline-front')[0].onmousemove = (event) => {
            this.timelineMouseMove(event);
        };
        // Как это обойти?
        document.getElementsByClassName('timeline-back')[0].onclick = (event) => {
            this.timelineClick(event);
        };
        // Как это обойти?
        document.getElementsByClassName('timeline-front')[0].onclick = (event) => {
            this.timelineClick(event);
        };
        document.getElementsByClassName('shuffle')[0].addEventListener('mouseover', this.shuffleButtonMouseOver.bind(this));
        document.getElementsByClassName('shuffle')[0].addEventListener('mouseout', this.shuffleButtonMouseOut.bind(this));
        document.getElementsByClassName('shuffle')[0].addEventListener('click', this.shuffleButtonClick.bind(this));
        document.getElementsByClassName('repeat')[0].addEventListener('mouseover', this.repeatButtonMouseOver.bind(this));
        document.getElementsByClassName('repeat')[0].addEventListener('mouseout', this.repeatButtonMouseOut.bind(this));
        document.getElementsByClassName('repeat')[0].addEventListener('click', this.repeatButtonClick.bind(this));
        document.getElementsByClassName('volume')[0].addEventListener('mouseover', this.volumeButtonMouseOver.bind(this));
        document.getElementsByClassName('volume')[0].addEventListener('mouseout', this.volumeButtonMouseOut.bind(this));
        document.getElementsByClassName('volume')[0].addEventListener('click', this.volumeButtonClick.bind(this));
        document.getElementsByClassName('volume-scale')[0].addEventListener('mouseover', this.volumeButtonMouseOver.bind(this));
        document.getElementsByClassName('volume-scale')[0].addEventListener('mouseout', this.volumeButtonMouseOut.bind(this));
        document.getElementsByClassName('volume-scale-back')[0].addEventListener('mousedown', this.volumeMouseDown.bind(this));
        // Как это обойти?
        document.getElementsByClassName('volume-scale-back')[0].onmouseup = (event) => {
            this.volumeMouseUp(event);
        }
        document.getElementsByClassName('volume-scale-front')[0].addEventListener('mousedown', this.volumeMouseDown.bind(this));
        // Как это обойти?
        document.getElementsByClassName('volume-scale-front')[0].onmouseup = (event) => {
            this.volumeMouseUp(event);
        }
        // Как это обойти?
        document.getElementsByClassName('volume-scale-back')[0].onclick = (event) => {
            this.volumeScaleClick(event);
        };
        // Как это обойти?
        document.getElementsByClassName('volume-scale-front')[0].onclick = (event) => {
            this.volumeScaleClick(event);
        };
        // Как это обойти?
        document.getElementsByClassName('volume-scale-back')[0].onmousemove = (event) => {
            this.volumeMouseMove(event);
        };
        // Как это обойти?
        document.getElementsByClassName('volume-scale-front')[0].onmousemove = (event) => {
            this.volumeMouseMove(event);
        };
        //this.elements.addButtons.addEventListener();
        //this.elements.deleteButtons.addEventListener();
    }

    windowMouseUp() {
        this.timelineDrag = false;
        this.volumeDrag = false;
    }
    audioTimeUpdate() {
        if (
            isNaN(document.getElementsByTagName('audio')[0].currentTime / document.getElementsByTagName('audio')[0].duration) ||
            this.timelineDrag
        ) {
            return;
        }
        this.drawTimeline(document.getElementsByTagName('audio')[0].currentTime / document.getElementsByTagName('audio')[0].duration);
    }
    audioEnded() {
        this.eventBus.emit('next', 'self');
    }
    triggerMouseOver() {
        document.getElementsByClassName('player-trigger-arrow')[0].style.visibility = 'visible';
    }
    triggerMouseOut() {
        document.getElementsByClassName('player-trigger-arrow')[0].style.visibility = 'hidden';
    }
    triggerClick() {
        if (this.mode === 'main') {
            return;
        }
        if (document.getElementsByClassName('player-trigger-arrow')[0].style.transform == 'rotate(180deg)') {
            document.getElementsByClassName('player-trigger-arrow')[0].style.transform = 'rotate(0)';
            document.getElementsByClassName('player-trigger-arrow')[0].style.marginLeft = '-3px';
        } else {
            document.getElementsByClassName('player-trigger-arrow')[0].style.transform = 'rotate(180deg)';
            document.getElementsByClassName('player-trigger-arrow')[0].style.marginLeft = '-1px';
        }
        const body = document.getElementsByTagName('body')[0];
        let left = body.clientWidth - 13;
        if (document.getElementsByClassName('main-pos')[0].style.left == left.toString() + 'px') {
            left = left - document.getElementsByClassName('main-pos')[0].clientWidth + 13;
        }
        document.getElementsByClassName('main-pos')[0].style.left = left + 'px';
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
        document.getElementsByClassName('current-time')[0].style.fontSize = '11px';
        document.getElementsByClassName('duration')[0].style.fontSize = '11px';
    }
    timelineMouseOut() {
        document.getElementsByClassName('current-time')[0].style.fontSize = '0';
        document.getElementsByClassName('duration')[0].style.fontSize = '0';
    }
    timelineMouseDown() {
        this.timelineDrag = true;
    }
    timelineMouseUp(event) {
        this.timelineDrag = false;
        const width = event.clientX - document.getElementsByClassName('timeline-back')[0].getBoundingClientRect().x;
        const ratio = width / document.getElementsByClassName('timeline-back')[0].getBoundingClientRect().width;
        this.eventBus.emit('rewind', ratio);
    }
    timelineMouseMove(event) {
        if (this.timelineDrag) {
            const width = event.clientX - document.getElementsByClassName('timeline-back')[0].getBoundingClientRect().x;
            const ratio = width / document.getElementsByClassName('timeline-back')[0].getBoundingClientRect().width;
            this.drawTimeline(ratio);
        }
    }
    timelineClick(event) {
        const width = event.clientX - document.getElementsByClassName('timeline-back')[0].getBoundingClientRect().x;
        const ratio = width / document.getElementsByClassName('timeline-back')[0].getBoundingClientRect().width;
        this.eventBus.emit('rewind', ratio);
    }
    shuffleButtonMouseOver() {
        if (!this.shuffled) {
            document.getElementsByClassName('shuffle')[0].style.opacity = '1';
        }
    }
    shuffleButtonMouseOut() {
        if (!this.shuffled) {
            document.getElementsByClassName('shuffle')[0].style.opacity = '0.4';
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
            document.getElementsByClassName('repeat')[0].style.opacity = '1';
        }
    }
    repeatButtonMouseOut() {
        if (this.repeatState === 0) {
            document.getElementsByClassName('repeat')[0].style.opacity = '0.4';
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
        document.getElementsByClassName('volume-scale')[0].style.transitionProperty = 'opacity, top';
        document.getElementsByClassName('volume-scale')[0].style.visibility = 'visible';
        document.getElementsByClassName('volume-scale')[0].style.opacity = '1';
        document.getElementsByClassName('volume-scale')[0].style.top = '48px';
        document.getElementsByClassName('volume')[0].style.opacity = '1';
    }
    volumeButtonMouseOut() {
        document.getElementsByClassName('volume-scale')[0].style.transitionProperty = 'opacity, visibility, top';
        document.getElementsByClassName('volume-scale')[0].style.visibility = 'hidden';
        document.getElementsByClassName('volume-scale')[0].style.opacity = '0';
        document.getElementsByClassName('volume-scale')[0].style.top = '58px';
        document.getElementsByClassName('volume')[0].style.opacity = '0.4';
    }
    volumeMouseDown() {
        this.volumeDrag = true;
    }
    volumeMouseUp(event) {
        this.volumeDrag = false;
        const height = document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height - (event.clientY - document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().y);
        this.volume = height / document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height;
        document.getElementsByTagName('audio')[0].volume = this.volume;
        this.drawVolume(height);
    }
    volumeMouseMove(event) {
        if (this.volumeDrag) {
            const height = document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height - (event.clientY - document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().y);
            this.volume = height / document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height;
            document.getElementsByTagName('audio')[0].volume = this.volume;
            this.drawVolume(height);
        }
    }
    volumeScaleClick(event) {
        const height = document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height - (event.clientY - document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().y);
        this.volume = height / document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height;
        document.getElementsByTagName('audio')[0].volume = this.volume;
        this.drawVolume(height);
    }
    volumeButtonClick() {
        if (this.muted) {
            this.eventBus.emit('unmute', {});
        } else {
            this.eventBus.emit('mute', {});
        }
    }

    drawPlay() {
        document.getElementsByClassName('play-pause')[0].src = 'static/img/play.svg';
        this.playing = false;
    }
    drawPause() {
        document.getElementsByClassName('play-pause')[0].src = 'static/img/pause.svg';
        this.playing = true;
    }
    updateTrack(track) {
        document.getElementById('cover').src = track.image;
        document.getElementById('artist').innerHTML = track.artist;
        document.getElementById('title').innerHTML = track.name;
        const minutes = Math.floor(track.duration / 60);
        const seconds = Math.floor(track.duration % 60);
        document.getElementsByClassName('duration')[0].innerHTML = minutes.toString() + ':' + (seconds < 10 ? '0' : '') + seconds.toString();
        document.getElementsByClassName('current-time')[0].innerHTML = '0:00';
    }
    drawTimeline(ratio) {
        const width = ratio * document.getElementsByClassName('timeline-back')[0].getBoundingClientRect().width;
        document.getElementsByClassName('timeline-front')[0].style.width = width.toString() + 'px';
        const minutes = Math.floor((ratio * document.getElementsByTagName('audio')[0].duration) / 60);
        const seconds = Math.floor((ratio * document.getElementsByTagName('audio')[0].duration) % 60);
        document.getElementsByClassName('current-time')[0].innerHTML = minutes.toString() + ':' + (seconds < 10 ? '0' : '') + seconds.toString();
    }
    drawShuffle() {
        document.getElementsByClassName('shuffle')[0].style.opacity = '1';
        this.shuffled = true;
    }
    drawUnshuffle() {
        document.getElementsByClassName('shuffle')[0].style.opacity = '0.4';
        this.shuffled = false;
    }
    drawRepeat() {
        document.getElementsByClassName('repeat')[0].style.opacity = '1';
        this.repeatState = 1;
    }
    drawRepeatOne() {
        document.getElementsByClassName('repeat')[0].src = 'static/img/repeat_one.svg';
        this.repeatState = 2;
    }
    drawUnrepeat() {
        document.getElementsByClassName('repeat')[0].src = 'static/img/repeat.svg';
        document.getElementsByClassName('repeat')[0].style.opacity = '0.4';
        this.repeatState = 0;
    }
    drawMute() {
        document.getElementsByClassName('volume')[0].src = 'static/img/volume_mute.svg';
        this.drawVolume(0);
        this.muted = true;
    }
    drawUnmute() {
        if (this.volume <= 0.5) {
            document.getElementsByClassName('volume')[0].src = 'static/img/volume_down.svg';
        } else {
            document.getElementsByClassName('volume')[0].src = 'static/img/volume_up.svg';
        }
        this.drawVolume(document.getElementsByClassName('volume-scale-back')[0].getBoundingClientRect().height * this.volume);
        this.muted = false;
    }
    drawVolume(height) {
        if (height === 0) {
            document.getElementsByClassName('volume-scale-front')[0].style.height = '0';
            return;
        }
        document.getElementsByClassName('volume-scale-front')[0].style.top = 0 - height.toString() + 'px';
        document.getElementsByClassName('volume-scale-front')[0].style.height = height.toString() + 'px';
    }
}
