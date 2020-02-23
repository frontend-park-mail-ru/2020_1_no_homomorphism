import {EventBus} from './eventBus.js'
import {IndexController} from './controllers/index.js'
import {LoginController} from './controllers/login.js'
import {SignupController} from './controllers/signup.js'
import {PlayerController} from './controllers/player.js'
import {ProfileController} from './controllers/profile.js'
import {SettingsController} from './controllers/settings.js'

window.addEventListener('DOMContentLoaded', () => {
    //const globalEventBus = new EventBus();
    const indexEventBus = new EventBus(),
          indexController = new IndexController(indexEventBus/*, globalEventBus*/);
    const loginEventBus = new EventBus(),
          loginController = new LoginController(loginEventBus/*, globalEventBus*/);
    const signupEventBus = new EventBus(),
          signupController = new SignupController(signupEventBus/*, globalEventBus*/);
    const playerEventBus = new EventBus(),
          playerController = new PlayerController(playerEventBus/*, globalEventBus*/);
    const profileEventBus = new EventBus(),
          profileController = new ProfileController(profileEventBus/*, globalEventBus*/);
    const settingsEventBus = new EventBus(),
          settingsController = new SettingsController(settingsEventBus/*, globalEventBus*/);
});
