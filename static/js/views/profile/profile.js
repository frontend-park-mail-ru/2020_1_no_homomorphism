import {PROFILE, URL, DOM, GLOBAL} from '@libs/constants';
import profile from '@views/profile/profile.tmpl.xml';
import BaseView from '@libs/base_view';
import User from '@libs/user';
import TrackListComponent from '@components/track_list/track_list';
import PlaylistsComponent from '@components/playlist_list/playlist_list';
import {globalEventBus} from '@libs/eventBus';
import ArtistListComponent from '@components/artist_list/artist_list';
import {inputSanitize} from '@libs/input_sanitize';

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
        this.trackListComponent = new TrackListComponent(eventBus, PROFILE);
        this.playlistsComponent = new PlaylistsComponent(eventBus,
            PROFILE.RENDER_PLAYLISTS,
            PROFILE.RENDER_ALBUMS);
        this.artistListComponent = new ArtistListComponent(eventBus, PROFILE.RENDER_ARTISTS);
        this.eventBus.on(PROFILE.CHOOSE_SECTION, this.chooseSection.bind(this));
        this.eventBus.on(PROFILE.RENDER_DATA, this.renderData.bind(this));
        this.eventBus.on(PROFILE.RENDER_STAT, this.renderStat.bind(this));
        this.eventBus.on(PROFILE.CHANGE_PLAYLIST_AMOUNT, this.changePlaylistAmount.bind(this));
        this.eventBus.on(PROFILE.CHANGE_TRACK_AMOUNT, this.changeTrackAmount.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        globalEventBus.emit(GLOBAL.COLLAPSE_IF_MOBILE);
        super.render(document.getElementsByClassName(DOM.CONTENT)[0], url);
        if (User.exists()) {
            this.eventBus.emit(PROFILE.GET_STAT);
        }
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
        document.getElementsByClassName('m-top-login')[0].innerHTML = inputSanitize(this.data.name);
        document.getElementsByClassName('m-top-name')[0].innerHTML = inputSanitize(this.data.login);
        document.getElementsByClassName('m-round-image')[0].src = this.data.image;
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
     * Изменение количества плейлистов
     * @param {number} dif
     */
    changePlaylistAmount(dif) {
        this.data.playlists += dif;
        document.getElementById('playlists').innerText = this.data.playlists;
    }

    /**
     * Изменение количества плейлистов
     * @param {number} newAmount
     */
    changeTrackAmount(newAmount) {
        document.getElementById('tracks').innerText = newAmount.toString();
    }

    /**
     * Определение секции нажатия
     */
    chooseSection() {
        switch (this.url) {
        case URL.PROFILE:
            globalEventBus.emit(GLOBAL.REDIRECT, URL.PROFILE_TRACKS);
            break;
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
        super.setData(data);
    }
}
