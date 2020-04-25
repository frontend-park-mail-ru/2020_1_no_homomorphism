import SearchDummyComponent from '@components/search_component/search_dummy_component';
import Api from '@libs/api';
import {GLOBAL, RESPONSE, SEARCH} from "@libs/constans";
import {globalEventBus} from "@libs/eventBus";

export default class SearchComponent {
    private input: string;
    private waitingAnswer: boolean;
    private isOpen: boolean;
    private requestInterval: NodeJS.Timeout;
    private dummySearch: SearchDummyComponent;

    constructor() {
        // globalEventBus.on(GLOBAL.REDIRECT, this.close.bind(this));
        this.dummySearch = new SearchDummyComponent();
        this.waitingAnswer = false;
        this.isOpen = false;
    }

    setClosed() {
        this.isOpen = false;
    }

    setOpened() {
        this.isOpen = true;
    }

    render(input: string) {
        this.isOpen = true;
        if (input === '') {
            clearTimeout(this.requestInterval);
            return;
        }
        this.input = input;
        if (this.waitingAnswer) {
            return;
        }
        this.waitingAnswer = true;
        this.requestInterval = setTimeout(this.getData.bind(this), SEARCH.INTERVAL);
    }

    getData() {
        this.waitingAnswer = false;
        Api.searchGet(this.input, SEARCH.AMOUNT_TOP)
            .then((res) => {
                switch (res.status) {
                    case RESPONSE.OK:
                        res.json()
                            .then((elem) => {
                                elem.input = this.input;
                                this.dummySearch.render(elem);
                            });
                        break;
                    default:
                        console.log(res);
                        console.error('I am a teapot');
                }
            });
    }

    /**
     * Закрытие раздела
     */
    close() {
        console.log('kek');
        if (this.isOpen) {
            document.getElementsByClassName('l-top-content')[0].removeChild(document.getElementsByClassName('l-top-content')[0].firstChild);
            this.isOpen = false;
        }
        (<HTMLInputElement>document.getElementsByClassName('m-search-input')[0]).value = '';
    }
}