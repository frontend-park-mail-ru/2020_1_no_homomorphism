import {EventBus} from '../eventBus.js'
import {LoginModel} from '../models/login.js'
import {LoginView} from '../views/login.js'

export class LoginController {
    constructor() {
        this.eventBus = new EventBus();
        this.model = new LoginModel(this.eventBus);
        this.view = new LoginView(this.eventBus);
    }
};
