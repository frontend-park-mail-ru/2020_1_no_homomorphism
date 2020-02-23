import {SettingsModel} from '../models/settings.js'
import {SettingsView} from '../views/settings.js'

export class SettingsController {
    constructor(eventBus/*, globalEventBus*/) {
        this.model = new SettingsModel(eventBus, {
            avatar          : {},
            birthday        : {},
            name            : '',
            email           : '',
            password        : '',
            passwordConfirm : '',
            outer           : [],
        ]),

        this.view = new SettingsView(eventBus, {
            avatar          : document.getElementById('avatar'),
            avatarUpload    : document.getElementById('avatar-upload'),
            birthday        : document.getElementById('birthday'),
            name            : document.getElementById('name'),
            email           : document.getElementById('email'),
            password        : document.getElementById('password'),
            passwordConfirm : document.getElementById('password-confirm'),
            outer           : document.getElementsByClassName('accounts-edit')[0].children,
            outerUrl        : document.getElementById('outer-url'),
            addOuter        : document.getElementById('add-outer'),
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
