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
     * Удаление данных и закрытие окна
     */
    delete() {
        document.getElementsByClassName('l-top-search')[0].innerHTML = '';
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
        // document.getElementsByClassName('m-button-without-size')[0].href = `/search/${data.input}`;
        this.setEventListeners.bind(this)();
    }

    /**
     * Прослушивание нажатий
     */
    setEventListeners() {
        // document.getElementsByClassName('m-search-input')[0]
        //     .addEventListener('keyup', (event) => {
        //         const value = event.target.value;
        //         if (event.keyCode === 13 && value !== '') {
        //             console.log(this._data);
        //             globalEventBus.emit(GLOBAL.REDIRECT, `/search/${this._data.input}`);
        //             // globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
        //         }
        //     });
    }
}
