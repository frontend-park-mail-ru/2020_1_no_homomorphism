import {EventBus} from '../eventBus.js'
import {SettingsModel} from '../models/settings.js'
import {SettingsView} from '../views/settings.js'

export class SettingsController {
    constructor(globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new SettingsModel(this.eventBus);
        this.view = new SettingsView(this.eventBus);
        this.globalEventBus = globalEventBus;

        this.globalEventBus.on('jump to settings', this.load);
    }

    load() {
        this.view.render(/*this.model.getUserData()*/);
    }
};
