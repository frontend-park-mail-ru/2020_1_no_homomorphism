import Router from '@libs/router';
import EventBus from '@libs/eventBus';
import {URL} from '@libs/constans';
import {NavbarController} from '@controllers/navbar';
import {IndexController} from '@controllers/news';
import {LoginController} from '@controllers/login';
import {SignupController} from '@controllers/signup';
import {PlayerController} from '@controllers/player';
import {ProfileController} from '@controllers/profile/profile';
import {SettingsController} from '@controllers/settings.js';
import {ArtistController} from '@controllers/artist.js';
import {PlaylistController} from '@controllers/playlist';
import {AlbumController} from '@controllers/album';

window.addEventListener('DOMContentLoaded', () => {
    const router = new Router();
    const globalEventBus = new EventBus();
    const navbarController = new NavbarController(router, globalEventBus);
    const indexController = new IndexController();
    const loginController = new LoginController(router, globalEventBus);
    const signupController = new SignupController(router, globalEventBus);
    const playerController = new PlayerController(router, globalEventBus);
    const profileController = new ProfileController(router, globalEventBus);
    const settingsController = new SettingsController(router, globalEventBus);
    const artistController = new ArtistController(router);
    const playlistController = new PlaylistController(router, globalEventBus);
    const albumController = new AlbumController(router, globalEventBus);

    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker
    //         .register('sw.js')
    //         .then((registration) => {
    //             console.log('SW registration ', registration);
    //         })
    //         .catch((err) => {
    //             console.log('SW Registration failed with ' + err);
    //         });
    // }

    router.addView(URL.NAVBAR, navbarController.view);
    router.addView(URL.PLAYER, playerController.view);
    router.addView(URL.MAIN, indexController.view);
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
    router.start();
    navbarController.view.render();
    playerController.view.render();
});
