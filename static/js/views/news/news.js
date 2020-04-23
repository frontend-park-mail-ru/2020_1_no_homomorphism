import news from '@views/news/news.tmpl.xml';
import artistList from '@views/news/artist_list.tmpl.xml';
import BaseView from '@libs/base_view';
import {MAIN, DOM} from '@libs/constans';

/**
 *  вью для главной
 */
export default class NewsView extends BaseView {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(news);
        this.eventBus = eventBus;
        this.artistList = [];
        this.eventBus.on(MAIN.RENDER_ARTIST, this.renderList.bind(this));
    }

    /**
     * рендерит главную страничку
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        this.eventBus.emit(MAIN.GET_LIST_DATA);
    }

    /**
     * Рендер
     * @param {Object} data
     */
    renderList(data) {
        document.getElementsByClassName(DOM.CONTENT)[0].innerHTML = artistList(data);
    }
}
