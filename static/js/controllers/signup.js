import {EventBus} from '../eventBus.js'
import {SignupModel} from '../models/signup.js'
import {SignupView} from '../views/signup.js'

export class SignupController {
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new SignupModel(this.eventBus);
        this.view = new SignupView(this.eventBus);

        this.eventBus.on('submit', this.model.submit.bind(this.model));
        this.eventBus.on('lol', this.view.showErrors);
        //this.eventBus.on('invalid', router.redirectToMain);
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
    }
}
