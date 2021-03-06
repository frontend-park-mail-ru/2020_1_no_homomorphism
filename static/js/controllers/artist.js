import ArtistModel from '@models/artist';
import ArtistView from '@views/artist/artist';
import EventBus from '@libs/eventBus';

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
    }
}
