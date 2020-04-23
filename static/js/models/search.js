import Api from '@libs/api';
import {RESPONSE, SEARCH} from '@libs/constans';

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
        this.eventBus.on(SEARCH.GET_DATA, this.getData.bind(this));
    }

    /**
     * Получение данных
     * @param {string} input
     */
    getData(input) {
        Api.searchGet(input, SEARCH.AMOUNT_TOP)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((elem) => {
                            // this.dummySearch.render(elem);
                        });
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
