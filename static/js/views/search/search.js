import BaseView from '@libs/base_view';
import search from '@views/search/search.tmpl.xml';

/**
 * Вью страницы поиска
 */
export default class SearchView extends BaseView {
    /**
     * Конструктор
     */
    constructor() {
        super(search);
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url = '') {
        super.render(root, url);
    }
}
