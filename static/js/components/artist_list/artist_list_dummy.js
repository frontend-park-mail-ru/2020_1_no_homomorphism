import artistList from '@components/artist_list/artist.tmpl.xml';
import newsArtistList from '@components/artist_list/news_artist.tmpl.xml';

/**
 * Компонент (очень глупенький) списка артистов
 */
export default class ArtistListDummyComponent {
    /**
     * Конструтор
     */
    constructor() {
        this._DOMItem = '';
        this._isNews = false;
    }

    /**
     * @param {boolean} isNewsSection
     */
    set news(isNewsSection) {
        this._isNews = isNewsSection;
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
            const elem = document.getElementsByClassName(this._DOMItem)[0];
            elem.classList.remove('m-empty-section');
            if (this._isNews) {
                elem.innerHTML = newsArtistList(data);
                this.setEventListeners();
                return;
            }
            elem.innerHTML = artistList(data);
        }
    }

    /**
     * setEventListeners for news scroll
     */
    setEventListeners() {
        document.getElementsByClassName('m-prev-button')[0].addEventListener('click', () => {
            document.getElementsByClassName('artists-section')[0]
                .scrollBy({left: -360, behavior: 'smooth'});
        });
        document.getElementsByClassName('m-next-button')[0].addEventListener('click', () => {
            document.getElementsByClassName('artists-section')[0]
                .scrollBy({left: 360, behavior: 'smooth'});
        });
    }
}
