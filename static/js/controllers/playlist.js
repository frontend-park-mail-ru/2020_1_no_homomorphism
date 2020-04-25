import EventBus from '@libs/eventBus';
import PlaylistModel from '@models/playlist';
import PlaylistView from '@views/playlist/playlist';
import {PLAYLIST} from '@libs/constans';

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
        this.model = new PlaylistModel(this.eventBus);
        this.view = new PlaylistView(this.eventBus);
        this.eventBus.on(PLAYLIST.REDIRECT, router.redirect.bind(router));
    }
}
