import search from '@components/search_component/search.xml';

/**
 * Глупенький компонент поиска (без высшего образования)
 */
export default class SearchDummyComponent {
    /** Конструктор
     */
    constructor() {
        this._data = {};
    }

    /**
     * Рендеринг
     * @param {Object} data
     */
    render(data) {
        this._data = data;
        document.getElementsByClassName('l-top-content')[0].innerHTML = search(data);
        document.getElementsByClassName('m-search-input')[0].value = data.input;
    }
}
