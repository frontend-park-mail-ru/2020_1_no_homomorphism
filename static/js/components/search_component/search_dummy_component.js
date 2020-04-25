import search from '@components/search_component/search.xml';
import {globalEventBus} from '@libs/eventBus';
import {GLOBAL} from '@libs/constans';

/**
 * Глупенький компонент поиска (без высшего образования)
 */
export default class SearchDummyComponent {
    /** Конструктор
     */
    constructor() {
        this.data = {};
    }

    /**
     * Рендеринг
     * @param {Object} data
     */
    render(data) {
        this.data = data;
        document.getElementsByClassName('l-top-search')[0].innerHTML = search(data);
        document.getElementsByClassName('m-button-without-size')[0].href = `/search/${data.input}`;
        this.setEventListeners.bind(this)();
    }

    /**
     * Прослушивание нажатий
     */
    setEventListeners() {
        document.getElementsByClassName('m-search-input')[0]
            .addEventListener('keyup', (event) => {
                const value = event.target.value;
                if (event.keyCode === 13 && value !== '') {
                    globalEventBus.emit(GLOBAL.REDIRECT, `/search/${this.data.input}`);
                }
            });
    }
}
