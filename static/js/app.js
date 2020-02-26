inport {Router} from '../js/modules/router.js'
import {IndexController} from './controllers/index.js'
import {LoginController} from './controllers/login.js'
import {SignupController} from './controllers/signup.js'
import {PlayerController} from './controllers/player.js'
import {ProfileController} from './controllers/profile.js'
import {SettingsController} from './controllers/settings.js'

window.addEventListener('DOMContentLoaded', () => {
    const baseTemplate = document.getElementsByClassName('container')[0];
    const indexController = new IndexController(baseTemplate);
    const loginController = new LoginController(baseTemplate);
    const signupController = new SignupController(baseTemplate);
    const playerController = new PlayerController(baseTemplate);
    const profileController = new ProfileController(baseTemplate);
    const settingsController = new SettingsController(baseTemplate);
    const router = new Router();

    router.addView('/', indexController.view);
    router.addView('/login', loginController.view);
    router.addView('/signup', signupController.view);
    router.addView('/player', playerController.view);
    router.addView('/profile', profileController.view);
    router.addView('/settings', settingsController.view);
    router.start();
});
