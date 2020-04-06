import news from '@views/news/news.tmpl.xml';
import BaseView from '@libs/base_view';
import '@css/base.css';

/**
 *  вью для главной
 */
export default class NewsView extends BaseView {
    /**
     * Конструктор
     */
    constructor() {
        super(news);
    }

    /**
     * рендерит главную страничку
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(root);
    }
}
