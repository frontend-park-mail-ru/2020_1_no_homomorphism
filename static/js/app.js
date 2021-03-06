import Router from '@libs/router';
import {URL, GLOBAL, DOM} from '@libs/constants';
import {NavbarController} from '@controllers/navbar';
import {NewsController} from '@controllers/news';
import {LoginController} from '@controllers/login';
import {SignupController} from '@controllers/signup';
import {PlayerController} from '@controllers/player';
import {ProfileController} from '@controllers/profile';
import {SettingsController} from '@controllers/settings';
import {ArtistController} from '@controllers/artist';
import {PlaylistController} from '@controllers/playlist';
import {AlbumController} from '@controllers/album';
import {SearchController} from '@controllers/search';
import {globalEventBus} from '@libs/eventBus';
import {setLanguage} from '@libs/language';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import '@css/_main.css';

window.addEventListener('DOMContentLoaded', load);

async function load() {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    HTMLCollection.prototype.find = Array.prototype.find;
    HTMLCollection.prototype.indexOf = Array.prototype.indexOf;
    HTMLCollection.prototype.slice = Array.prototype.slice;

    if (window.localStorage.getItem('lang')) {
        await setLanguage(window.localStorage.getItem('lang'));
    } else {
        await setLanguage('eng');
    }

    const router = new Router();
    const navbarController = new NavbarController(router);
    const newsController = new NewsController(router);
    const loginController = new LoginController(router);
    const signupController = new SignupController(router);
    const playerController = new PlayerController(router);
    const profileController = new ProfileController(router);
    const settingsController = new SettingsController(router);
    const artistController = new ArtistController(router);
    const playlistController = new PlaylistController(router);
    const albumController = new AlbumController(router);
    const searchController = new SearchController(router);

    router.addView(URL.NAVBAR, navbarController.view);
    router.addView(URL.PLAYER, playerController.view);
    router.addView(URL.MAIN, newsController.view);
    router.addView(URL.LOGIN, loginController.view);
    router.addView(URL.SIGN_UP, signupController.view);
    router.addView(URL.PROFILE, profileController.view);
    router.addView(URL.PROFILE_TRACKS, profileController.view);
    router.addView(URL.PROFILE_PLAYLISTS, profileController.view);
    router.addView(URL.PROFILE_ALBUMS, profileController.view);
    router.addView(URL.PROFILE_ARTISTS, profileController.view);
    router.addView(URL.SETTINGS, settingsController.view);
    router.addView(URL.ARTIST, artistController.view);
    router.addView(URL.PLAYLIST, playlistController.view);
    router.addView(URL.ALBUM, albumController.view);
    router.addView(URL.SEARCH, searchController.view);
    router.start();
    navbarController.view.render();
    playerController.view.render();
    if ('serviceWorker' in navigator) {
        runtime.register();
    }
}

window.addEventListener('storage', (e) => {
    if (e.key === 'isPlaying' && e.newValue === 'false') {
        globalEventBus.emit(GLOBAL.PAUSE);
    }
    if (e.key === 'theme' && e.newValue) {
        globalEventBus.emit(GLOBAL.RENDER_THEME, e.newValue);
    }
    if (e.key === 'lang' && e.newValue) {
        setLanguage(e.newValue);
    }
});

window.onpopstate = (event) => {
    document.getElementsByClassName(DOM.NAVBAR)[0].classList.remove('is-untouchable');
    document.getElementsByClassName(DOM.CONTENT)[0].classList.remove('is-un-emphasized');
    document.getElementsByClassName(DOM.TOP_CONTENT)[0].innerHTML = '';
};
