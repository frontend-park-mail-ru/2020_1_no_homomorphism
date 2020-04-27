import EventBus from '@libs/eventBus';
import AlbumModel from '@models/album';
import AlbumView from '@views/album/album';

/**
 * Контроллер для страницы плейлиста
 */
export class AlbumController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new AlbumModel(this.eventBus);
        this.view = new AlbumView(this.eventBus);
    }
}
