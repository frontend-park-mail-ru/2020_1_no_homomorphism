import SearchView from '@views/search/search';
import SearchModel from '@models/search';
import EventBus from '@libs/eventBus';

/**
 * Контроллер страницы поиска
 */
export class SearchController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.view = new SearchView(this.eventBus);
        this.model = new SearchModel(this.eventBus);
    }
}
