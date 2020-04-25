import EventBus from '@libs/eventBus';
import AlbumModel from '@models/album';
import AlbumView from '@views/album/album';
import {ALBUM} from '@libs/constans';

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
        this.eventBus.on(ALBUM.REDIRECT, router.redirect.bind(router));
    }
}
