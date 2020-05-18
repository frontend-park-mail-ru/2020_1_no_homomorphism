import news from '@views/news/news.tmpl.xml';
import newsSection from '@views/news/news_section.tmpl.xml';
import BaseView from '@libs/base_view';
import {MAIN, GLOBAL} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';

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
        this.eventBus.on(MAIN.RENDER_SUBSCRIPTIONS, this.renderList.bind(this));
        this.eventBus.on(MAIN.RENDER_TRACKS_LIST, this.renderList.bind(this));
        this.eventBus.on(MAIN.RENDER_ARTISTS, this.renderList.bind(this));
        globalEventBus.on(GLOBAL.HIDE_SUBSCRIPTIONS, () => {
            document.getElementById('subscriptions-section').remove();
        });
    }

    /**
     * рендерит главную страничку
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(root, url);
        this.eventBus.emit(MAIN.GET_SUBSCRIPTIONS_DATA);
        this.eventBus.emit(MAIN.GET_TRACKS_OF_THE_DAY_DATA);
        this.eventBus.emit(MAIN.GET_ARTISTS_DATA);
    }

    /**
     * Рендер
     * @param {Object} data
     */
    renderList(data) {
        const node = document.getElementsByClassName(data.domItem)[0];
        node.innerHTML = newsSection(data);
        node.classList.remove(data.domItem);
        node.firstChild.lastChild.classList.add(data.domItem);
    }
}
