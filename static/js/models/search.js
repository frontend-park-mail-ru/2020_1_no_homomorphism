import Api from '@libs/api';
import {RESPONSE, SEARCH} from '@libs/constans';
import PlaylistsComponent from '@components/playlist_list_component/playlist_list_component';
import TrackListComponent from '@components/track_list_component/track_list_component';
import ArtistListComponent from '@components/artist_list_component/artist_list_component';

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
        this.playlistListComponent = new PlaylistsComponent(this.eventBus, SEARCH);
        this.trackListComponent = new TrackListComponent(this.eventBus, SEARCH);
        this.artistListComponent = new ArtistListComponent(this.eventBus, SEARCH);
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
                                    type: 'track',
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
