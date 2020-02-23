import {SignupModel} from '../models/signup.js'
import {SignupView} from '../views/signup.js'

export class SignupController {
    constructor(eventBus/*, globalEventBus*/) {
        this.model = new SignupModel(eventBus, {
            name            : '',
            login           : '',
            sex             : {
                male   : true,
                female : false,
                other  : false,
            },
            email           : '',
            password        : '',
            passwordConfirm : '',
        ]),

        this.view = new SignupView(eventBus, {
            name            : document.getElementById('name'),
            login           : document.getElementById('login'),
            sex             : {
                male   : document.getElementById('male'),
                female : document.getElementById('female'),
                other  : document.getElementById('other')
            },
            email           : document.getElementById('email'),
            password        : document.getElementById('password'),
            passwordConfirm : document.getElementById('password-confirm'),
            submit          : document.getElementById('submit'),
        }),

        this.eventBus = eventBus;
        //this.globalEventBus = globalEventBus;

        eventBus.on('valid', to => this.redirect(to));
        //globalEventBus.on('redirect to signup', () => this.eventBus.emit('load', {}))
    }

    redirect(to) {
        /*if (to == '') {
            to = '/';
        }
        this.globalEventBus.emit('redirect to ' + to, {});*/
    }
};
