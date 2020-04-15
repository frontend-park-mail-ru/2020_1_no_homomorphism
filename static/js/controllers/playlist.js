import EventBus from '@libs/eventBus';
import PlaylistModel from '@models/playlist';
import PlaylistView from '@views/playlist/playlist';
import {PLAYLIST} from '@libs/constans';
import {globalEventBus} from '@libs/eventBus';

/**
 * Контроллер для страницы плейлиста
 */
export class PlaylistController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new PlaylistModel(this.eventBus, globalEventBus);
        this.view = new PlaylistView(this.eventBus, globalEventBus);
        this.eventBus.on(PLAYLIST.REDIRECT, router.redirect.bind(router));
    }
}
