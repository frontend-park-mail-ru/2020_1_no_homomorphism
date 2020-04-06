import NewsModel from '@models/news';
import NewsView from '@views/news/news';
import EventBus from '@libs/eventBus.js';
import {MAIN} from '@libs/constans';

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

        this.eventBus.on(MAIN.REDIRECT, router.redirect.bind(router));
        this.eventBus.on(MAIN.NO_ANSWER, router.redirect.bind(router));
    }
}
