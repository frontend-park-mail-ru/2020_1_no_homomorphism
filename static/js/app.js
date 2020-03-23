import Router from './libs/router.js';
import EventBus from './libs/eventBus.js';
import {NavbarController} from './controllers/navbar.js';
import {IndexController} from './controllers/index.js';
import {LoginController} from './controllers/login.js';
import {SignupController} from './controllers/signup.js';
import {PlayerController} from './controllers/player.js';
import {ProfileController} from './controllers/profile/profile.js';
import {SettingsController} from './controllers/settings.js';
import {URL} from '/static/js/libs/constans.js';

window.addEventListener('DOMContentLoaded', () => {
    const router = new Router();
    const globalEventBus = new EventBus();
    const navbarController = new NavbarController(router, globalEventBus);
    const indexController = new IndexController();
    const loginController = new LoginController(router, globalEventBus);
    const signupController = new SignupController(router, globalEventBus);
    const playerController = new PlayerController(router);
    const profileController = new ProfileController(router);
    const settingsController = new SettingsController(router, globalEventBus);
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker
    //         .register('sw.js')
    //         .then((registration) => {
    //             console.log('ServiceWorker registration', registration);
    //         })
    //         .catch((err) => {
    //             console.log('SW Registration failed with ' + err);
    //         });
    // }

    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('static/js/sw.js').then(function(registration) {
    //             console.log('service worker registration succeeded:', registration);
    //         },
    //         function (error) {
    //             console.log('service worker registration failed:', error);
    //         });
    // } else {
    //     console.log('service workers are not supported.');
    // }

    console.log('KEKEKEKKEKEKE');
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/static/js/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration', registration);
            })
            .catch((err) => {
                console.error(err);
            });
    }

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
    router.start();
    playerController.view.render();
    navbarController.view.render();
});
