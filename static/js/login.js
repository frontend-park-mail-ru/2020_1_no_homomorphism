import {EventBus} from './eventBus.js';
import {LoginModel} from '../../models/login.js';
import {LoginView} from '../../views/login.js';
import {LoginController} from '../../controllers/login.js';

window.addEventListener('load', () => {
    const eventBus = new EventBus(),
          model = new LoginModel(eventBus, ['', '', false, false]),
          view = new LoginView(eventBus, {
              'login'    : document.getElementById('login'),
              'password' : document.getElementById('password'),
              'remember' : document.getElementById('remember'),
              'submit'   : document.getElementById('submit'),
          }),
          controller = new LoginController(model, view, eventBus);
});
