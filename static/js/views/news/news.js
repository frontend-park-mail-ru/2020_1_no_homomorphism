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
        this.eventBus.on(MAIN.RENDER_TRACKS, this.renderList.bind(this));
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
     * @param {function} setEventListeners
     */
    renderList(data, setEventListeners) {
        let elem = document.createElement('div');
        elem.innerHTML = newsSection(data);
        elem = elem.firstChild;
        elem.appendChild(data.node);
        document.getElementById(data.domItem).appendChild(elem);
        if (data.domItem === 'tracks-section') {
            setTimeout(setEventListeners, 1000);
        }
    }
}
