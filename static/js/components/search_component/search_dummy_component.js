import search from '@components/search_component/search.xml';

/**
 * Глупенький компонент поиска (без высшего образования)
 */
export default class SearchDummyComponent {
    /** Конструктор
     * @param {function} callback
     */
    constructor(callback) {
        this._data = {};
        this._getIdByClick = callback;
    }

    /**
     * Рендеринг
     * @param {Object} data
     */
    render(data) {
        this._data = data;
        console.log(data);
        document.getElementsByClassName('l-top-content')[0].innerHTML = search(data);
        document.getElementsByClassName('m-search-input')[0].value = data.input;
        this.setEventListener.bind(this)();
    }

    /**
     * setEventListener
     */
    setEventListener() {
        document.querySelectorAll('.m-small-track').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
    }

    /**
     * Проигрывание трека
     * @param {Object} event
     */
    playTrack(event) {
        this._getIdByClick(event, this._data.tracks);
    }
}
