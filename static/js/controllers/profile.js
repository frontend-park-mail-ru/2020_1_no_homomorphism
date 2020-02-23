import {ProfileModel} from '../models/profile.js'
import {ProfileView} from '../views/profile.js'

export class ProfileController {
    constructor(eventBus/*, globalEventBus*/) {
        this.model = new ProfileModel(eventBus, {
            avatar   : {},
            login    : '',
            birthday : {},
            name     : '',
            email    : '',
            outer    : [],
        });
        this.view = new ProfileView(eventBus, {
            avatar   : document.getElementById('avatar'),
            login    : document.getElementById('login'),
            birthday : document.getElementById('birthday'),
            name     : document.getElementById('name'),
            email    : document.getElementById('email'),
            outer    : document.getElementsByClassName('outer'),
        });
        this.eventBus = eventBus;
        //this.globalEventBus = globalEventBus;
    }
};
