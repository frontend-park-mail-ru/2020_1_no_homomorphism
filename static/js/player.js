const body = document.getElementsByTagName('body')[0];

const trigger = document.getElementsByClassName('player-trigger')[0];
const arrow = document.getElementsByClassName('player-trigger-arrow')[0];

trigger.onmouseover = () => {
    arrow.style.visibility = 'visible';
};

trigger.onmouseout = () => {
    arrow.style.visibility = 'hidden';
};

trigger.onclick = () => {
    const arrow = document.getElementsByClassName('player-trigger-arrow')[0];
    if (arrow.style.transform == 'rotate(180deg)') {
        arrow.style.transform = 'rotate(0)';
    } else {
        arrow.style.transform = 'rotate(180deg)';
    }
    const player = document.getElementsByClassName('main-pos')[0];
    let left = body.clientWidth - 13;
    if (player.style.left == left.toString() + 'px') {
        left = left - player.clientWidth + 13;
    }
    player.style.left = left + 'px';
};

const timelineZone = document.getElementsByClassName('timeline')[0];
const timelineBack = timelineZone.children[0];
const timelineFront = timelineZone.children[1];
const currentTime = document.getElementsByClassName('current-time')[0];
const durationElement = document.getElementsByClassName('duration')[0];
const duration = 184;

timelineZone.onmouseover = () => {
    currentTime.style.fontSize = '11px';
    durationElement.style.fontSize = '11px';
};

timelineZone.onmouseout = () => {
    currentTime.style.fontSize = '0';
    durationElement.style.fontSize = '0';
};

timelineBack.onclick = (event) => {
    const width = event.clientX - timelineBack.getBoundingClientRect().x;
    timelineFront.style.width = width.toString() + 'px';
    const ratio = width / timelineBack.getBoundingClientRect().width;
    const minutes = Math.floor((ratio * duration) / 60);
    const seconds = Math.floor((ratio * duration) % 60);
    currentTime.innerHTML = minutes.toString() + ':' + (seconds < 10 ? '0' : '') + seconds.toString();
};

timelineFront.onclick = (event) => {
    const width = event.clientX - timelineBack.getBoundingClientRect().x;
    timelineFront.style.width = width.toString() + 'px';
    const ratio = width / timelineBack.getBoundingClientRect().width;
    const minutes = Math.floor((ratio * duration) / 60);
    const seconds = Math.floor((ratio * duration) % 60);
    currentTime.innerHTML = minutes.toString() + ':' + (seconds < 10 ? '0' : '') + seconds.toString();
};

const playPasueButton = document.getElementsByClassName('play-pause')[0];
let play = false;

playPasueButton.onclick = () => {
    if (play) {
        playPasueButton.src = '/img/play.svg';
    } else {
        playPasueButton.src = '/img/pause.svg';
    }
    play = !play;
};

const shuffleButton = document.getElementsByClassName('shuffle')[0];
let shuffled = false;
const repeatButton = document.getElementsByClassName('repeat')[0];
let repeatState = 0;
const volumeButton = document.getElementsByClassName('volume')[0];
let volumeOn = true;
let volumeLevel = 0.4;

shuffleButton.onmouseover = () => {
    if (!shuffled) {
        shuffleButton.style.opacity = '1';
    }
};

shuffleButton.onmouseout = () => {
    if (!shuffled) {
        shuffleButton.style.opacity = '0.4';
    }
};

shuffleButton.onclick = () => {
    if (!shuffled) {
        shuffleButton.style.opacity = '1';
    } else {
        shuffleButton.style.opacity = '0.4';
    }
    shuffled = !shuffled;
};

repeatButton.onmouseover = () => {
    if (repeatState === 0) {
        repeatButton.style.opacity = '1';
    }
};

repeatButton.onmouseout = () => {
    if (repeatState === 0) {
        repeatButton.style.opacity = '0.4';
    }
};

repeatButton.onclick = () => {
    switch (repeatState) {
        case 0:
            repeatButton.style.opacity = '1';
            repeatState = 1;
            break;
        case 1:
            repeatButton.src = '/img/repeat_one.svg';
            repeatState = 2;
            break;
        case 2:
            repeatButton.src = '/img/repeat.svg';
            repeatButton.style.opacity = '0.4';
            repeatState = 0;
            break;
    }
};

volumeButton.onmouseover = () => {
    volumeButton.style.opacity = '1';
};

volumeButton.onmouseout = () => {
    volumeButton.style.opacity = '0.4';
};

volumeButton.onclick = () => {
    if (volumeOn || volumeLevel == 0) {
        volumeButton.src = '/img/volume_mute.svg';
    } else {
        if (volumeLevel > 0 && volumeLevel <= 0.5) {
            volumeButton.src = '/img/volume_down.svg';
        } else {
            volumeButton.src = '/img/volume_up.svg';
        }
    }
    volumeOn = !volumeOn;
};

document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementsByClassName('main-pos')[0];
    console.log(player);
    console.log(body);
    const left = body.clientWidth - 13;
    console.log(left);
    player.style.left = left.toString() + 'px';
    console.log(player.style.left);
    const navbar = document.getElementsByClassName('navbar')[0];
    console.log(navbar);
    let top = 0;
    let height = document.documentElement.clientHeight;
    if (navbar !== undefined) {
        top = navbar.clientHeight;
        height -= navbar.clientHeight;
    }
    console.log(top);
    console.log(height);
    player.style.top = top.toString() + 'px';
    player.style.height = height.toString() + 'px';
    trigger.style.height = height.toString() + 'px';
    console.log(player.style.top);
    console.log(player.style.height);
    console.log(trigger.style.height);
    console.log('topkek');

    if (volumeLevel == 0) {
        volumeButton.src = '/img/volume_mute.svg';
    } else if (volumeLevel <= 0.5) {
        volumeButton.src = '/img/volume_down.svg';
    } else {
        volumeButton.src = '/img/volume_up.svg';
    }
});
