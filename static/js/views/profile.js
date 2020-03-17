/**
 * вью для профиля
 */
export class ProfileView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('draw profile tracks', this.drawTracks.bind(this));
        this.openedTracks = false;
        this.openedAlbums = false;
        this.openedPlaylist = false;
        this.openedArtists = false;
    }

    /**
     * Подписка на события
     * */
    setEventListeners() {
        console.log('SET EVENT LISTENER');
        document.getElementById('profile-tracks-title').addEventListener('click',
            this.trackClick.bind(this));
        document.getElementById('profile-albums-title').addEventListener('click',
            this.albumClick.bind(this));
        document.getElementById('profile-playlists-title').addEventListener('click',
            this.playlistClick.bind(this));
        document.getElementById('profile-subscriptions-title').addEventListener('click',
            this.subscriptionsClick.bind(this));
        /* document.addEventListener('click', (event) => {
            while (event !== window && event !== document.body && event != null) {
                console.log(event.target);
                if (event.target.getAttribute('id') === 'title-my-music') {
                    event.preventDefault();
                    this.musicClick();
                    break;
                } else if (event.target.getAttribute('id') === 'title-settings') {
                    event.preventDefault();
                    this.settingsClick();
                    break;
                } else if (event.target.getAttribute('id') === 'title-info') {
                    event.preventDefault();
                    this.infoClick();
                    break;
                } else {
                    console.log(event.target.parentElement);
                    event = event.target.parentNode;
                }
            }
        });*/
    }

    /**
     * Рендер
     * @param {Object} root
     */
    render(root) {
        this.eventBus.on('user data', (data) => {
            // eslint-disable-next-line no-undef
            root.innerHTML = nunjucks.render('../../../views/profile.njk', data);
            this.setEventListeners();
        });
        this.eventBus.emit('get user data', {});
    }

    /**
     * Нажатие
     */
    trackClick() {
        this.openedAlbums = false;
        if (this.openedTracks) {
            this.undrawTracks();
            this.openedTracks = false;

            console.log('CLOSED');
        } else {
            console.log('OPENED');
            this.openedTracks = true;
            this.eventBus.emit('get user tracks', {});
        }
        /* const deeping = document.getElementsByClassName('deeping')[0];
        if (deeping.style.height == '0px') {
            deeping.style.height = '13em';
        } else {
            deeping.style.height = '0';
        }
        const selectionCard = document.getElementsByClassName('selection-card')[0];
        if (selectionCard.style.opacity == '0') {
            selectionCard.style.opacity = '1';
        } else {
            selectionCard.style.opacity = '0';
        }
        for (let i = 0; i < deeping.children.length; i++) {
            if (deeping.children[i].children[0] != undefined) {
                if (deeping.children[i].children[0].style.opacity == '0') {
                    if (deeping.children[i].children[0].className == 'deeping-list-item') {
                        deeping.children[i].children[0].style.opacity = '0.4';
                    } else {
                        deeping.children[i].children[0].style.opacity = '1';
                    }
                } else {
                    deeping.children[i].children[0].style.opacity = '0';
                }
            }
        }
        for (let track = deeping.nextElementSibling;
            track.className.indexOf('track') != -1; track = track.nextElementSibling) {
            if (track.style.visibility == 'hidden') {
                track.style.transitionDelay = '0.5s';
                track.style.visibility = 'visible';
            } else {
                track.style.transitionDelay = '0s';
                track.style.visibility = 'hidden';
            }
        }*/
    }

    /**
     * Нажатие
     */
    albumClick() {
        if (this.openedTracks) {
            this.undrawTracks();
            this.openedTracks = false;
        }
        console.log(this.openedAlbums);
        if (this.openedAlbums) {
            this.undrawAlbums();
            this.openedAlbums = false;
        } else {
            this.openedAlbums = true;
            const elem = document.getElementById('profile-album-list');
            // eslint-disable-next-line no-undef,max-len
            elem.innerHTML += nunjucks.render('../../../views/templates/profile_albums.njk');
        }
    }

    /**
     * Нажатие
     */
    playlistClick() {
        console.log('CLICKED INFO');
        if (document.getElementsByClassName('deeping')[0].style.height == '13em') {
            this.musicClick();
        }
    }

    /**
     * Нажатие
     */
    subscriptionsClick() {
        console.log('CLICKED INFO');
        if (document.getElementsByClassName('deeping')[0].style.height == '13em') {
            this.musicClick();
        }
    }

    /**
     * Удаление отрисовки списка треков
     */
    undrawAlbums() {
        document.getElementsByClassName('l-profile-album-list')[0].innerHTML = '';
    }

    /**
     * Удаление отрисовки списка треков
     */
    undrawTracks() {
        document.getElementsByClassName('l-profile-track-list')[0].innerHTML = '';
        const elem = document.getElementById('profile-track-list');
        elem.classList.remove('l-profile-base');
    }

    /**
     * Отрисовка списка треков
     * @param {Object} tracks
     */
    drawTracks(tracks) {
        console.log('draw');
        console.log(tracks);
        const elem = document.getElementById('profile-track-list');
        for (let i = 0; i < tracks.length; i++) {
            elem.className += ' l-profile-base';
            // eslint-disable-next-line no-undef,max-len
            elem.innerHTML += nunjucks.render('../../../views/templates/profile_track.njk', tracks[i]);
        }
    }
}

/*
scrolling();
{
    document.addEventListener('scroll', this.scrolling);
    document.addEventListener('scroll', (event) => {
        event.preventDefault();
        this.scrolling();
    });
    this.eventBus.emit('get user tracks', {});

    document.getElementById('title-my-music');
    const top = document.getElementsByClassName('l-profile-top-image')[0];
    const size = top.getBoundingClientRect();
    const offset = 100;
    const intElemScrollTop = document.scrollTop;
    console.log(intElemScrollTop);
    if (size.bottom - offset < window.scrollY) {
        // Смещение раздела фото+логин
        document.getElementsByClassName('l-profile-top-info')[0].style.marginTop = '-150px';
        document.getElementsByClassName('l-profile-top-info')[0].style.transition = '0.3s';
        // Дополнительное смещение логина
        document.getElementsByClassName('l-profile-login')[0].style.marginTop = '-90px';
        document.getElementsByClassName('l-profile-login')[0].style.transition = '0.3s';
        // Уменьшение аватаро4ки
        document.getElementsByClassName('m-profile-avatar')[0].style.height = '100px';
        document.getElementsByClassName('m-profile-avatar')[0].style.width = '100px';
        document.getElementsByClassName('m-profile-avatar')[0].style.transition = '0.3s';
    } else { // Изменение размера картинки фона
        document.getElementsByClassName('l-profile-top-image')[0].style.marginTop =
            `${window.scrollY}px`;
        document.getElementsByClassName('l-profile-top-image')[0].style.height =
            `${300 - window.scrollY}px`;
        document.getElementsByClassName('l-profile-top-info')[0].style.marginTop = '-120px';
        document.getElementsByClassName('l-profile-top-info')[0].style.transition = '0.3s';
        document.getElementsByClassName('m-profile-avatar')[0].style.height = '180px';
        document.getElementsByClassName('m-profile-avatar')[0].style.width = '180px';
        document.getElementsByClassName('m-profile-avatar')[0].style.transition = '0.3s';
        document.getElementsByClassName('l-profile-login')[0].style.marginTop = '0';
        document.getElementsByClassName('l-profile-login')[0].style.transition = '0.3s';
    }
}
*/
