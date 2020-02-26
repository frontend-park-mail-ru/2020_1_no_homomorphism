import {EventBus} from '../eventBus.js'
import {SignupModel} from '../models/signup.js'
import {SignupView} from '../views/signup.js'

export class SignupController {
    constructor() {
        this.eventBus = new EventBus();
        this.model = new SignupModel(this.eventBus);
        this.view = new SignupView(this.eventBus);
    }
};
