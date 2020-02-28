import {EventBus} from '../eventBus.js'
import {ProfileModel} from '../models/profile.js'
import {ProfileView} from '../views/profile.js'

export class ProfileController {
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new ProfileModel(this.eventBus);
        this.view = new ProfileView(this.eventBus);

        this.eventBus.on('load profile', this.model.loadProfile);
        this.eventBus.on('show profile', this.view.showProfile);
        this.eventBus.on('invalid', this.view.showErrors); // TODO Error
        this.eventBus.on('redirect to main', router.redirectToMain.bind(router));
        this.eventBus.on('no answer', router.redirectToMain.bind(router));
        //this.eventBus.on('no answer', nunjucks.render('error', {status: 'sosi', message: 'zhopy'}));
    }
}
