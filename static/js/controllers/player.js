import {EventBus} from '../eventBus.js'
import {PlayerModel} from '../models/player.js'
import {PlayerView} from '../views/player.js'

export class PlayerController {
    constructor(globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new PlayerModel(this.eventBus);
        this.view = new PlayerView(this.eventBus);
        this.globalEventBus = globalEventBus;

        this.globalEventBus.on('jump to player', this.load);
    }

    load() {
        this.view.render();
    }
};
