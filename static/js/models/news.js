import Api from '@libs/api';
import {MAIN, URL, RESPONSE, GLOBAL} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';
import ArtistListComponent from '@components/artist_list/artist_list';

/**
 * Модель для главной страницы
 */
export default class NewsModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.artists = [];
        this.artistListComponent = new ArtistListComponent(eventBus, MAIN.RENDER_ARTISTS);
        this.eventBus.on(MAIN.GET_LIST_DATA, this.getArtistListData.bind(this));
    }

    /**
     * Получает списка артистов
     */
    getArtistListData() {
        Api.artistListGet('0', '100')
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(MAIN.RENDER_ARTISTS,
                                {
                                    domItem: 'kekkkk',
                                    artists: data.artists,
                                    type: 'main',
                                });
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
