import artistList from '@components/artist_list/artist.tmpl.xml';

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
        if (document.getElementsByClassName(this._DOMItem)[0] !== undefined) {
            document.getElementsByClassName(this._DOMItem)[0].innerHTML = artistList(data);
        }
    }
}
