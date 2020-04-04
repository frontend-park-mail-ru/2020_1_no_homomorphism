import EventBus from '@libs/eventBus.js';
import PlaylistModel from '@models/playlist';
import PlaylistView from '@views/playlist/playlist';
import {PLAYLIST} from '@libs/constans.js';
/**
 * Контроллер для страницы плейлиста
 */
export class PlaylistController {
    /**
     * Конструктор
     * @param {Router} router
     * @param {EventBus} globalEventBus
     */
    constructor(router, globalEventBus) {
        this.eventBus = new EventBus();
        this.model = new PlaylistModel(this.eventBus, globalEventBus);
        this.view = new PlaylistView(this.eventBus);
        this.eventBus.on(PLAYLIST.REDIRECT, router.redirect.bind(router));
    }
}
