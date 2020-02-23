import {EventBus} from '../eventBus.js'
import {LoginModel} from '../models/login.js'
import {LoginView} from '../views/login.js'

export class LoginController {
    constructor(/*, globalEventBus*/) {
        this.eventBus = new EventBus();
        this.model = new LoginModel(this.eventBus);
        this.view = new LoginView(this.eventBus);
        //this.globalEventBus = globalEventBus;

        this.eventBus.on('valid', this.redirect);
        //globalEventBus.on('redirect to login', () => this.eventBus.emit('load', {}))
    }

    redirect(to) {
        /*if (to == '') {
            to = '/';
        }
        this.globalEventBus.emit('redirect to ' + to, {});*/
    }
};
