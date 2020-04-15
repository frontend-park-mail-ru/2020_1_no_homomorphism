import EventBus from '@libs/eventBus';
import PlayerModel from '@models/player';
import PlayerView from '@views/player/player';
import {PLAYER} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

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
        this.model = new PlayerModel(this.eventBus, globalEventBus);
        this.view = new PlayerView(this.eventBus, globalEventBus);
        this.eventBus.on(PLAYER.REDIRECT, router.redirect.bind(router));
    }
}
