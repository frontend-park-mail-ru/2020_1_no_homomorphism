import NewsModel from '@models/news';
import NewsView from '@views/news/news';
/**
 * Контроллер для главной страницы
 */
export class IndexController {
    /**
     * Конструктор
     */
    constructor() {
        this.model = new NewsModel();
        this.view = new NewsView();
    }
}
