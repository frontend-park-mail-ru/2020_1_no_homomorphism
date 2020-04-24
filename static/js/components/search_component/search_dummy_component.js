import search from '@components/search_component/search.xml';
import {DOM} from '@libs/constans';
/**
 * Глупенький компонент поиска (без высшего образования)
 */
export default class SearchDummyComponent {
    /** Конструктор
     */
    constructor() {
    }

    /**
     * Рендеринг
     * @param {Object} data
     */
    render(data) {
        document.getElementsByClassName('l-top-content')[0].innerHTML += search(data);
    }
}
