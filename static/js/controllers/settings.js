import {EventBus} from '../eventBus.js'
import {SettingsModel} from '../models/settings.js'
import {SettingsView} from '../views/settings.js'

export class SettingsController {
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new SettingsModel(this.eventBus);
        this.view = new SettingsView(this.eventBus);

        this.eventBus.on('invalid', this.view.showErrors);
        this.eventBus.on('valid', this.view.showSuccess);

        this.eventBus.on('avatar upload', this.model.resetAvatar);
        this.eventBus.on('submit', this.model.submit);
        this.eventBus.on('load profile settings', this.model.loadProfile);
        this.eventBus.on('show profile settings', this.view.showProfile);
        //this.eventBus.on('add outer', this.model.addOuter);
        this.eventBus.on('redirect to main', router.redirectToMain);
        this.eventBus.on('get user data', this.model.getUserData.bind(this));


    }
}
