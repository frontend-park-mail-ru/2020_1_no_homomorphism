import search from '@components/search/search.xml';
import {lang} from '@libs/language';

/**
 * Глупенький компонент поиска (без высшего образования)
 */
export default class SearchDummyComponent {
    /** Конструктор
     * @param {function} callback
     * @param {function} close
     */
    constructor(callback, close) {
        this._data = {};
        this._getIdByClick = callback;
        this.close = close;
    }

    /**
     * Рендеринг
     * @param {Object} data
     */
    render(data) {
        this._data = data;
        data.lang = lang;
        document.getElementsByClassName('l-top-content')[0].innerHTML = search(data);
        document.getElementsByClassName('m-search-input')[0].value = data.input;
        document.getElementsByClassName('m-search-input')[0].classList.add('with-modal-window');
        this.setEventListener.bind(this)();
    }

    /**
     * setEventListener
     */
    setEventListener() {
        window.addEventListener('scroll', () => {
            this.close(true, false);
        });
        document.querySelectorAll('.m-small-track').forEach((track) => {
            track.onclick = (event) => this.playTrack.bind(this)(event);
        });
    }

    /**
     * Проигрывание трека
     * @param {Object} event
     */
    playTrack(event) {
        this._getIdByClick(event);
    }
}
