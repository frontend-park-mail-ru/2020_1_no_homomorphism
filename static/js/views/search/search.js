import BaseView from '@libs/base_view';
import search from '@views/search/search.tmpl.xml';
import {DOM, SEARCH, GLOBAL} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';
import {lang} from '@libs/language';

/**
 * Вью страницы поиска
 */
export default class SearchView extends BaseView {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(search);
        this.eventBus = eventBus;
        this.eventBus.on(SEARCH.RENDER_DATA, this.renderData.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url = '') {
        globalEventBus.emit(GLOBAL.COLLAPSE_IF_MOBILE);
        this.eventBus.emit(SEARCH.GET_DATA, {input: url});
    }

    /**
     * Установка данных
     * @param {Object} data
     */
    renderData(data) {
        data.lang = lang;
        document.getElementsByClassName(DOM.CONTENT)[0].innerHTML = search(data);
    }
}
