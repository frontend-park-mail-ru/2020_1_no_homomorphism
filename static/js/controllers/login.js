import {LoginModel} from '../models/login.js'
import {LoginView} from '../views/login.js'

export class LoginController {
    constructor(eventBus/*, globalEventBus*/) {
        this.model = new LoginModel(eventBus, {
            login    : '',
            password : '',
            remember : false,
        }),
        this.view = new LoginView(eventBus, {
            login    : document.getElementById('login'),
            password : document.getElementById('password'),
            remember : document.getElementById('remember'),
            submit   : document.getElementById('submit'),
        }),
        this.eventBus = eventBus;
        //this.globalEventBus = globalEventBus;

        eventBus.on('valid', to => this.redirect(to));
        //globalEventBus.on('redirect to login', () => this.eventBus.emit('load', {}))
    }

    redirect(to) {
        /*if (to == '') {
            to = '/';
        }
        this.globalEventBus.emit('redirect to ' + to, {});*/
    }
};
