import {PROFILE, URL, DOM} from '@libs/constans';
import profile from '@views/profile/profile.tmpl.xml';
import BaseView from '@libs/base_view';

/**
 * вью для профиля
 */
export default class ProfileView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(profile);
        this.eventBus = eventBus;
        this.currentOpen = '';
        this.eventBus.on(PROFILE.CHOOSE_SECTION, this.chooseSection.bind(this));
        this.eventBus.on(PROFILE.RENDER_DATA, this.renderData.bind(this));
        this.eventBus.on(PROFILE.RENDER_STAT, this.renderStat.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.CONTENT)[0], url);
        this.eventBus.emit(PROFILE.GET_DATA);
        this.eventBus.emit(PROFILE.CHOOSE_SECTION);
        this.eventBus.emit(this.currentOpen);
    }

    /**
     * Рендер
     * @param {Object} data
     */
    renderData(data) {
        this.setData(Object.assign(this.data, data));
        document.getElementsByClassName('m-top-login')[0].innerHTML = data.login;
        document.getElementsByClassName('m-top-name')[0].innerHTML = data.name;
        document.getElementsByClassName('m-round-image')[0].src = data.image;
    }

    /**
     * Рендер
     * @param {Object} data
     */
    renderStat(data) {
        this.setData(Object.assign(this.data, data));
        document.getElementById('tracks').innerText = data.tracks;
        document.getElementById('albums').innerText = data.albums;
        document.getElementById('playlists').innerText = data.playlists;
        document.getElementById('artists').innerText = data.artists;
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

    /**
     * @param {Object} data
     */
    setData(data) {
        super.setData(data); // TODO очищение памяти при логауте !!!
    }
}
