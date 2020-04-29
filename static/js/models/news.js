import Api from '@libs/api';
import {MAIN, URL, RESPONSE, GLOBAL} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';

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
        Api.artistListGet('0', '100')
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.artists = data.artists;
                            this.eventBus.emit(MAIN.RENDER_ARTIST, this.artists);
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
