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
