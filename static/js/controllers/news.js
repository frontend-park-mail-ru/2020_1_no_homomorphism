import NewsModel from '@models/news';
import NewsView from '@views/news/news';
import EventBus from '@libs/eventBus';

/**
 * Контроллер для главной страницы
 */
export class NewsController {
    /**
     * Конструктор
     * @param {Router} router
     */
    constructor(router) {
        this.eventBus = new EventBus();
        this.model = new NewsModel(this.eventBus);
        this.view = new NewsView(this.eventBus);
    }
}
