import {EventBus} from '../eventBus.js'
import {LoginModel} from '../models/login.js'
import {LoginView} from '../views/login.js'

export class LoginController {
    constructor(globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new LoginModel(this.eventBus);
        this.view = new LoginView(this.eventBus);
        this.globalEventBus = globalEventBus;

        this.eventBus.on('valid', this.redirect);
        this.globalEventBus.on('jump to login', this.load);
    }

    load() {
        this.view.render();
    }
    
    redirect(to) {
        if (to == '') {
            to = '/';
        }
        this.globalEventBus.emit('redirect', to);
    }
};
