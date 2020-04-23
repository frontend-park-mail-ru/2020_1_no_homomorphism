import SearchView from '@views/search/search';
import SearchModel from '@models/search';
import EventBus from '@libs/eventBus';
import {SEARCH} from '@libs/constans';

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
        this.eventBus.on(SEARCH.REDIRECT, router.redirect.bind(router));
    }
}
