import artistList from '@components/artist_list/artist.tmpl.xml';
import {lang} from '@libs/language';

/**
 * Компонент (очень глупенький) списка артистов
 */
export default class ArtistListDummyComponent {
    /**
     * Конструтор
     */
    constructor() {
        this._DOMItem = '';
    }

    /**
     * @param {string} input
     */
    set DOMItem(input) {
        this._DOMItem = input;
    }

    /**
     * Отрисовка
     * @param {Object} data
     */
    render(data) {
        data.lang = lang;
        document.getElementsByClassName(this._DOMItem)[0].innerHTML = artistList(data);
    }
}
