import {EventBus} from '../eventBus.js'
import {SignupModel} from '../models/signup.js'
import {SignupView} from '../views/signup.js'

export class SignupController {
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new SignupModel(this.eventBus);
        this.view = new SignupView(this.eventBus);

        this.eventBus.on('submit', this.model.submit);
        this.eventBus.on('invalid', this.view.showErrors);
        this.eventBus.on('redirect to main', router.redirectToMain);


        this.eventBus.on('logout', this.model.logout);
    }
}
