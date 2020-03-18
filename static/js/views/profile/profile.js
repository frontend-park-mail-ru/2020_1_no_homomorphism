import * as C from '../../libs/constans.js';

/**
 * вью для профиля
 */
export class ProfileView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.currentOpen = '';
        this.eventBus.on(C.CHOOSE_SECTION, this.chooseSection.bind(this));
    }


    /**
     * Подписка на события
     * */
    setEventListeners() {
        document.getElementById(C.ID_TRACKS_SECTION).addEventListener('click',
            this.trackClick.bind(this));
        document.getElementById(C.ID_PLAYLISTS_SECTION).addEventListener('click',
            this.playlistClick.bind(this));
        document.getElementById(C.ID_ALBUMS_SECTION).addEventListener('click',
            this.albumClick.bind(this));
        document.getElementById(C.ID_ARTISTS_SECTION).addEventListener('click',
            this.artistsClick.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        this.eventBus.on(C.RENDER_PROFILE_DATA, (data) => {
            // eslint-disable-next-line no-undef
            root.innerHTML = nunjucks.render(C.PROFILE_TEMPLATE, data);
            this.setEventListeners();
            this.eventBus.emit(this.currentOpen, {});
        });
        this.eventBus.emit(C.GET_PROFILE_DATA, {});
        this.eventBus.emit(C.CHOOSE_SECTION, {url});
    }

    /**
     * Определение секции нажатия
     * @param {Object} str
     */
    chooseSection(str) {
        switch (str.url) {
        case C.URL_PROFILE:
        case C.URL_TRACKS:
            this.currentOpen = C.GET_PROFILE_TRACKS;
            break;
        case C.URL_PLAYLISTS:
            this.currentOpen = C.GET_PROFILE_PLAYLISTS;
            break;
        case C.URL_ALBUMS:
            this.currentOpen = C.GET_PROFILE_ALBUMS;
            break;
        case C.URL_ARTISTS:
            this.currentOpen = C.GET_PROFILE_ALBUMS;
            break;
        }
    }

    /**
     * Нажатие на треки
     */
    trackClick() {
        if (this.currentOpen !== C.GET_PROFILE_TRACKS) {
            const prevSection = document.getElementById(this.currentOpen);
            const curSection = document.getElementById(C.ID_TRACKS_SECTION);
            prevSection.classList.remove(C.SELECTED_CLASS);
            curSection.className += ' ' + C.SELECTED_CLASS;
            console.log(C.GET_PROFILE_TRACKS);
            this.eventBus.emit(C.GET_PROFILE_TRACKS, {});
        }
        // }
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
     * Нажатие на альбомы
     */
    albumClick() {
        this.eventBus.emit(С.GET_PROFILE_ALBUMS, {});
    }


    /**
     * Нажатие на плейлисты
     */
    playlistClick() {
        if (document.getElementsByClassName('deeping')[0].style.height == '13em') {
            this.musicClick();
        }
    }

    /**
     * Нажатие
     */
    artistsClick() {
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
     * Удаление отрисовки списка треков
     */
    setCurrentOpenTracks() {
        this.currentOpen = 0;
    }

    /**
     * Удаление отрисовки списка треков
     */
    setCurrentOpenPlaylists() {
        this.currentOpen = 1;
    }

    /**
     * Удаление отрисовки списка треков
     */
    setCurrentOpenAlbums() {
        this.currentOpen = 2;
    }

    /**
     * Удаление отрисовки списка треков
     */
    setCurrentOpenArtists() {
        this.currentOpen = 3;
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
