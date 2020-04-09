import Api from '@libs/api';
import {MAIN, URL, RESPONSE} from '@libs/constans';

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
        this.eventBus.on(MAIN.GET_LIST_DATA, this.getArtistListData.bind(this));
    }

    /**
     * Получает списка артистов
     */
    getArtistListData() {
        Api.artistListFetch('0', '100')
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.artists = data.artists;
                            this.eventBus.emit(MAIN.RENDER_ARTIST_LIST, this.artists);
                        });
                    break;
                case RESPONSE.BAD_REQUEST:
                    this.eventBus.emit(MAIN.NO_ANSWER, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(MAIN.REDIRECT, URL.MAIN);
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
