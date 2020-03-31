import news from '@views/news/news.tmpl.xml';
import BaseView from '@libs/base_view';
import {DOM} from '@libs/constans';
import '@css/base.css';

/**
 *  вью для главной
 */
export default class NewsView extends BaseView{
    /**
     * Конструктор
     */
    constructor() {
        super(news)
    }

    /**
     * рендерит главную страничку
     */
    render(root, url ) {
        super.render(root);
    }
}
