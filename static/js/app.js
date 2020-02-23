//import {EventBus} from './eventBus.js'
import {IndexController} from './controllers/index.js'
import {LoginController} from './controllers/login.js'
import {SignupController} from './controllers/signup.js'
import {PlayerController} from './controllers/player.js'
import {ProfileController} from './controllers/profile.js'
import {SettingsController} from './controllers/settings.js'

window.addEventListener('DOMContentLoaded', () => {
    //const globalEventBus = new EventBus();
    const indexController = new IndexController(/*, globalEventBus*/);
    const loginController = new LoginController(/*, globalEventBus*/);
    const signupController = new SignupController(/*, globalEventBus*/);
    const playerController = new PlayerController(/*, globalEventBus*/);
    const profileController = new ProfileController(/*, globalEventBus*/);
    const settingsController = new SettingsController(/*, globalEventBus*/);
});
