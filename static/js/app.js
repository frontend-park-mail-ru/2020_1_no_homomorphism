import {Router} from './libs/router.js';
import {EventBus} from './eventBus.js';
import {NavbarController} from './controllers/navbar.js';
import {IndexController} from './controllers/index.js';
import {LoginController} from './controllers/login.js';
import {SignupController} from './controllers/signup.js';
import {PlayerController} from './controllers/player.js';
import {ProfileController} from './controllers/profile.js';
import {SettingsController} from './controllers/settings.js';

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

    router.addView('navbar', navbarController.view);
    router.addView('player', playerController.view);
    router.addView('/', indexController.view);
    router.addView('/login', loginController.view);
    router.addView('/signup', signupController.view);
    router.addView('/profile', profileController.view);
    router.addView('/settings', settingsController.view);
    router.start();
    playerController.view.render();
    navbarController.view.render();
});
