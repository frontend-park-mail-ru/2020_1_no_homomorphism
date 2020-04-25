import EventBus from '@libs/eventBus';
import PlayerModel from '@models/player';
import PlayerView from '@views/player/player';

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
    }
}
