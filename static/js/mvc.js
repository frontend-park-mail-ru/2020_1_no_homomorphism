import {EventBus} from './eventBus.js'
import {LoginModel} from './models/login.js'
import {LoginView} from './views/login.js'
import {LoginController} from './controllers/login.js'

window.addEventListener('DOMContentLoaded', () => {
    const globalEventBus = new EventBus();
    const loginEventBus = new EventBus(),
          loginModel = new LoginModel(loginEventBus, ['', '', false, false]),
          loginView = new LoginView(loginEventBus, {
              'login'    : document.getElementById('login'),
              'password' : document.getElementById('password'),
              'remember' : document.getElementById('remember'),
              'submit'   : document.getElementById('submit'),
          }),
          loginController = new LoginController(model, view, loginEventBus, globalEventBus);
    const signupEventBus = new EventBus(),
          signupModel = new LoginModel(signupEventBus, ['', '', false, false]),
          signupView = new LoginView(signupEventBus, {
                    'login'    : document.getElementById('login'),
                    'password' : document.getElementById('password'),
                    'remember' : document.getElementById('remember'),
                    'submit'   : document.getElementById('submit'),
                }),
          signupController = new LoginController(model, view, signupEventBus, globalEventBus);
});
