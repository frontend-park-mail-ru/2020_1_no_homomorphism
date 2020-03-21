import {PROFILE, TEMPLATES, URL} from '../../libs/constans.js';
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
        this.url = '';
        this.timeRendered = 0;
        this.eventBus.on(PROFILE.CHOOSE_SECTION, this.chooseSection.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        if (this.timeRendered === 0) {
            this.eventBus.on(PROFILE.RENDER_DATA, (data) => {
                // eslint-disable-next-line no-undef
                root.innerHTML = nunjucks.render(TEMPLATES.PROFILE, data);
                this.eventBus.emit(PROFILE.CHOOSE_SECTION, {});
                this.eventBus.emit(this.currentOpen, {});
            });
        }
        this.url = url;
        this.eventBus.emit(PROFILE.GET_DATA, {});
        this.timeRendered++;
    }

    /**
     * Определение секции нажатия
     */
    chooseSection() {
        switch (this.url) {
        case URL.PROFILE:
        case URL.PROFILE_TRACKS:
            this.currentOpen = PROFILE.ID_TRACKS_SECTION;
            break;
        case URL.PROFILE_PLAYLISTS:
            this.currentOpen = PROFILE.ID_PLAYLISTS_SECTION;
            break;
        case URL.PROFILE_ALBUMS:
            this.currentOpen = PROFILE.ID_ALBUMS_SECTION;
            break;
        case URL.PROFILE_ARTISTS:
            this.currentOpen = PROFILE.ID_ARTISTS_SECTION;
            break;
        }
        const curSection = document.getElementById(this.currentOpen);
        curSection.classList.add(PROFILE.SELECTED_CLASS);
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
