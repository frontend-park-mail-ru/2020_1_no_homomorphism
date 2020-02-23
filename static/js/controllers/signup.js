import {EventBus} from '../eventBus.js'
import {SignupModel} from '../models/signup.js'
import {SignupView} from '../views/signup.js'

export class SignupController {
    constructor(/*, globalEventBus*/) {
        this.eventBus = new EventBus();
        this.model = new SignupModel(this.eventBus);
        this.view = new SignupView(this.eventBus);
        //this.globalEventBus = globalEventBus;

        this.eventBus.on('valid', this.redirect);
        //globalEventBus.on('redirect to signup', () => this.eventBus.emit('load', {}))
    }

    redirect(to) {
        /*if (to == '') {
            to = '/';
        }
        this.globalEventBus.emit('redirect to ' + to, {});*/
    }
};
