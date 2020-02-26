import {EventBus} from '../eventBus.js'
import {ProfileModel} from '../models/profile.js'
import {ProfileView} from '../views/profile.js'

export class ProfileController {
    constructor(baseTemplate) {
        this.eventBus = new EventBus();
        this.model = new ProfileModel(this.eventBus);
        this.view = new ProfileView(baseTemplate, this.eventBus);
    }
};
