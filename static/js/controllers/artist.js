import ArtistModel from '@models/artist';
import ArtistView from '@views/artist/artist';
/**
 * Контроллер для страницы артиста
 */
export class ArtistController {
    /**
     * Конструктор
     */
    constructor() {
        this.model = new ArtistModel();
        this.view = new ArtistView();
    }
}
