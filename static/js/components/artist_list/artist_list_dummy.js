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
     * @return {Node}
     */
    render(data) {
        const elem = document.createElement('div');
        elem.innerHTML = artistList(data);
        return elem;
    }
}
