import SearchView from '@views/search/search';
import SearchModel from '@models/search';
import EventBus from '@libs/eventBus';

/**
 * Контроллер страницы поиска
 */
export class SearchController {
    /**
     * Конструктор
     */
    constructor() {
        this.eventBus = new EventBus();
        this.searchView = new SearchView();
        this.searchModel = new SearchModel();
    }
}
