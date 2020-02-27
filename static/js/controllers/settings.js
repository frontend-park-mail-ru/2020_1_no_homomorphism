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

        this.eventBus.on('get user data', this.model.getUserData.bind(this.model));
        this.eventBus.on('avatar upload', this.model.resetAvatar.bind(this.model));
        this.eventBus.on('submit', this.model.submit.bind(this.model));
        //this.eventBus.on('add outer', this.model.addOuter.bind(this.model));
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
        this.eventBus.on('redirect to profile', router.redirectToProfile.bind(router));
    }
}
