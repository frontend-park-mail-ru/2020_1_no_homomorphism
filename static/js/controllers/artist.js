import ArtistModel from '@models/artist';
import ArtistView from '@views/artist/artist';
import EventBus from '@libs/eventBus';
import {ARTIST} from '@libs/constans';

/**
 * Контроллер для страницы артиста
 */
export class ArtistController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new ArtistModel(this.eventBus);
        this.view = new ArtistView(this.eventBus);

        this.eventBus.on(ARTIST.REDIRECT, router.redirect.bind(router));
        this.eventBus.on(ARTIST.NO_ANSWER, router.redirect.bind(router));
    }
}
