import {Router} from './libs/router.js';
import {EventBus} from './libs/eventBus.js';
import {NavbarController} from './controllers/navbar.js';
import {IndexController} from './controllers/index.js';
import {LoginController} from './controllers/login.js';
import {SignupController} from './controllers/signup.js';
import {PlayerController} from './controllers/player.js';
import {ProfileController} from './controllers/profile/profile.js';
import {SettingsController} from './controllers/settings.js';
import * as C from '/static/js/libs/constans.js';

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

    router.addView(C.URL_NAVBAR, navbarController.view);
    router.addView(C.URL_PLAYER, playerController.view);
    router.addView(C.URL_MAIN, indexController.view);
    router.addView(C.URL_LOGIN, loginController.view);
    router.addView(C.URL_SIGN_UP, signupController.view);
    router.addView(C.URL_PROFILE, profileController.view);
    router.addView(C.URL_PROFILE_TRACKS, profileController.view);
    router.addView(C.URL_PROFILE_PLAYLISTS, profileController.view);
    router.addView(C.URL_PROFILE_ALBUMS, profileController.view);
    router.addView(C.URL_PROFILE_ARTISTS, profileController.view);
    router.addView(C.URL_SETTINGS, settingsController.view);
    router.start();
    playerController.view.render();
    navbarController.view.render();
});
