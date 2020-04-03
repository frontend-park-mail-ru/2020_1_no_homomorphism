import ArtistModel from '@models/artist';
import ArtistView from '@views/artist/artist';
import EventBus from '@libs/eventBus.js';
/**
 * Контроллер для страницы артиста
 */
export class ArtistController {
    /**
     * Конструктор
     */
    constructor() {
        this.eventBus = new EventBus();
        this.model = new ArtistModel(this.eventBus);
        this.view = new ArtistView(this.eventBus);
    }
}
