import EventBus from '@libs/eventBus.js';
import PlayerModel from '@models/player.js';
import PlayerView from '@views/player/player.js';
import {PLAYER} from '@libs/constans.js';
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
        this.eventBus.on(PLAYER.REDIRECT, router.redirect.bind(router));
    }
}
