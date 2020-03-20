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
        this.previousOpen = '';
        this.currentOpen = '';
        this.url = '';
        this.timeRendered = 0;
        this.eventBus.on(C.CHOOSE_SECTION, this.chooseSection.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        if (this.timeRendered === 0) {
            this.eventBus.on(C.RENDER_PROFILE_DATA, (data) => {
                // eslint-disable-next-line no-undef
                root.innerHTML = nunjucks.render(C.PROFILE_TEMPLATE, data);
                this.eventBus.emit(C.CHOOSE_SECTION, {});
                console.log(this.currentOpen);
                this.eventBus.emit(this.currentOpen, {});
            });
        }
        this.url = url;
        this.eventBus.emit(C.GET_PROFILE_DATA, {});
        this.timeRendered++;
    }

    /**
     * Определение секции нажатия
     */
    chooseSection() {
        switch (this.url) {
        case C.URL_PROFILE:
        case C.URL_PROFILE_TRACKS:
            this.currentOpen = C.ID_TRACKS_SECTION;
            break;
        case C.URL_PROFILE_PLAYLISTS:
            this.currentOpen = C.ID_PLAYLISTS_SECTION;
            break;
        case C.URL_PROFILE_ALBUMS:
            this.currentOpen = C.ID_ALBUMS_SECTION;
            break;
        case C.URL_PROFILE_ARTISTS:
            this.currentOpen = C.ID_ARTISTS_SECTION;
            break;
        }
        const curSection = document.getElementById(this.currentOpen);
        curSection.classList.add(C.SELECTED_CLASS);
    }

    /**
     * Нажатие на треки
     */
    trackClick() {
        console.log('----trackClick  ' + this.previousOpen);
        if (this.previousOpen !== C.ID_TRACKS_SECTION) {
            this.previousOpen = this.currentOpen;
            this.currentOpen = C.ID_TRACKS_SECTION;
            this.eventBus.emit(C.ID_TRACKS_SECTION, {});
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
        console.log('----albumClick  ' + this.previousOpen);
        this.currentOpen = C.ID_ALBUMS_SECTION;
        // if (this.previousOpen !== C.ID_ALBUMS_SECTION) {
        //     this.previousOpen = this.currentOpen;
        //     this.currentOpen = C.ID_ALBUMS_SECTION;
        //     this.eventBus.emit(C.ID_ALBUMS_SECTION, {});
        // }
    }

    /**
     * Нажатие на плейлисты
     */
    playlistClick() {
        console.log('----playlistClick  ' + this.previousOpen);
        console.log(this.eventBus);
        this.currentOpen = C.ID_PLAYLISTS_SECTION;
        // if (this.previousOpen !== C.ID_PLAYLISTS_SECTION) {
        //     this.previousOpen = this.currentOpen;
        //     this.currentOpen = C.ID_PLAYLISTS_SECTION;
        //     this.eventBus.emit(C.ID_PLAYLISTS_SECTION, {});
        // }
    }

    /**
     * Нажатие
     */
    artistsClick() {
        console.log('artistsClick  ' + this.previousOpen);
        this.currentOpen = C.ID_ARTISTS_SECTION;
        // if (this.previousOpen !== C.ID_ARTISTS_SECTION) {
        //     this.previousOpen = this.currentOpen;
        //     this.currentOpen = C.ID_ARTISTS_SECTION;
        //     this.eventBus.emit(C.ID_ARTISTS_SECTION, {});
        // }
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
