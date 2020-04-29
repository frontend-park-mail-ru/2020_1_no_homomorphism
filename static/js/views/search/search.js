import BaseView from '@libs/base_view';
import search from '@views/search/search.tmpl.xml';
import {DOM, SEARCH} from '@libs/constans';
import TrackListComponent from '@components/track_list/track_list';
import PlaylistsComponent from '@components/playlist_list/playlist_list';

/**
 * Вью страницы поиска
 */
export default class SearchView extends BaseView {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(search);
        this.eventBus = eventBus; // l-search-artists
        this.playlistListComponent = new PlaylistsComponent(this.eventBus, SEARCH);
        this.trackListCOmponent = new TrackListComponent(this.eventBus, SEARCH);
        this.eventBus.on(SEARCH.RENDER_DATA, this.renderData.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url = '') {
        this.eventBus.emit(SEARCH.GET_DATA, {input: url});
    }

    /**
     * Установка данных
     * @param {Object} data
     */
    renderData(data) {
        document.getElementsByClassName(DOM.CONTENT)[0].innerHTML = search(data);
    }
}
