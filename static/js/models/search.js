import Api from '@libs/api';
import {RESPONSE, SEARCH} from '@libs/constants';
import PlaylistsComponent from '@components/playlist_list/playlist_list';
import TrackListComponent from '@components/track_list/track_list';
import ArtistListComponent from '@components/artist_list/artist_list';

/**
 * Модель страницы поиска
 */
export default class SearchModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.playlistListComponent = new PlaylistsComponent(this.eventBus, SEARCH.RENDER_ALBUMS);
        this.trackListComponent = new TrackListComponent(this.eventBus, SEARCH);
        this.artistListComponent = new ArtistListComponent(this.eventBus, SEARCH.RENDER_ARTISTS);
        this.eventBus.on(SEARCH.GET_DATA, this.getData.bind(this));
    }

    /**
     * Получение данных
     * @param {Object} data
     */
    getData(data) {
        Api.searchGet(data.input, SEARCH.AMOUNT)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((elem) => {
                            this.eventBus.emit(SEARCH.RENDER_DATA, elem);
                            this.eventBus.emit(SEARCH.RENDER_ALBUMS,
                                {
                                    domItem: 'l-search-albums',
                                    list: elem.albums,
                                    type: 'album',
                                });
                            this.eventBus.emit(SEARCH.RENDER_TRACKS,
                                {
                                    domItem: 'l-search-tracks',
                                    tracks: elem.tracks,
                                    type: 'search',
                                });
                            this.eventBus.emit(SEARCH.RENDER_ARTISTS,
                                {
                                    domItem: 'l-search-artists',
                                    artists: elem.artists,
                                    type: 'search',
                                });
                        });
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
