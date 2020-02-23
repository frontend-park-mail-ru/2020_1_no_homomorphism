import {EventBus} from '../eventBus.js'
import {SettingsModel} from '../models/settings.js'
import {SettingsView} from '../views/settings.js'

export class SettingsController {
    constructor(/*, globalEventBus*/) {
        this.eventBus = new EventBus();
        this.model = new SettingsModel(this.eventBus);
        this.view = new SettingsView(this.eventBus);
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
