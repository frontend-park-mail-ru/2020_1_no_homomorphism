import {EventBus} from '../eventBus.js';
import {PlayerModel} from '../models/player.js';
import {PlayerView} from '../views/player.js';

/**
 * контроллер для плеера
 */
export class PlayerController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new PlayerModel(this.eventBus);
        this.view = new PlayerView(this.eventBus);
        this.eventBus.on('redirect', router.redirect.bind(router));
    }
}
