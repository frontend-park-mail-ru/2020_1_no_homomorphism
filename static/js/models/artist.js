import Api from '@libs/api.js';
import {ARTIST, URL} from '@libs/constans.js';

/**
 * Модель для страницы артиста
 */
export default class ArtistModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(ARTIST.GET_DATA, this.getArtistData.bind(this));
    }

    getArtistData() {
        Api.artistFetch()
            .then((res) => {
                if (res === undefined) {
                    this.eventBus.emit(ARTIST.REDIRECT, URL.MAIN);
                    return;
                }
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(ARTIST.RENDER_DATA, data);
                        });
                } else {
                    this.eventBus.emit(ARTIST.NO_ANSWER, URL.MAIN);
                }
            });
    }
}
