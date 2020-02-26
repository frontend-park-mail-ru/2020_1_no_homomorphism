import {EventBus} from '../eventBus.js'
import {ProfileModel} from '../models/profile.js'
import {ProfileView} from '../views/profile.js'

export class ProfileController {
    constructor() {
        this.eventBus = new EventBus();
        this.model = new ProfileModel(this.eventBus);
        this.view = new ProfileView(this.eventBus);

        this.eventBus.on('load profile', this.model.loadProfile);
        this.eventBus.on('show profile', this.view.showProfile);
        this.eventBus.on('invalid', this.view.showErrors);
    }
}
