import {IndexController} from './controllers/index.js'
import {LoginController} from './controllers/login.js'
import {SignupController} from './controllers/signup.js'
import {PlayerController} from './controllers/player.js'
import {ProfileController} from './controllers/profile.js'
import {SettingsController} from './controllers/settings.js'

window.addEventListener('DOMContentLoaded', () => {
    const indexController = new IndexController();
    const loginController = new LoginController();
    const signupController = new SignupController();
    const playerController = new PlayerController();
    const profileController = new ProfileController();
    const settingsController = new SettingsController();
});
