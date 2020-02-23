import {EventBus} from '../eventBus.js'
import {ProfileModel} from '../models/profile.js'
import {ProfileView} from '../views/profile.js'

export class ProfileController {
    constructor(/*, globalEventBus*/) {
        this.eventBus = new EventBus();
        this.model = new ProfileModel(this.eventBus);
        this.view = new ProfileView(this.eventBus);
        //this.globalEventBus = globalEventBus;
    }
};
