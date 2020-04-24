import SearchDummyComponent from '@components/search_component/search_dummy_component';
import Api from '@libs/api';
import {DOM, RESPONSE, SEARCH} from "@libs/constans";

export default class SearchComponent {
    private input: string;
    private waitingAnswer: boolean;
    private requestInterval: NodeJS.Timeout;
    private dummySearch: SearchDummyComponent;

    constructor() {
        this.dummySearch = new SearchDummyComponent();
        this.waitingAnswer = false;
    }

    render(input: string) {
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

    setEventListeners() {
        document.addEventListener('click', this.analyzeTouch.bind(this), {once: true});
    }

    analyzeTouch(event: MouseEvent) {
        const choosePlaylist = document.getElementsByClassName('l-search')[0];
        if (choosePlaylist === undefined) {
            return;
        }
        const isClickInside = choosePlaylist.contains(<HTMLInputElement>event.target);
        if (isClickInside) {
            console.log('inside');
            return;
        }
        console.log('outside');
        this.close();
    }

    /**
     * Закрытие раздела
     */
    close() {
        // document
        //     .getElementsByClassName(DOM.CONTENT)[0]
        //     .removeChild(
        //         document.getElementsByClassName(DOM.CONTENT)[0].lastChild);
        document
            .getElementsByClassName(DOM.TOP_CONTENT)[0]
            .removeChild(
                document.getElementsByClassName(DOM.TOP_CONTENT)[0].lastChild);
        // this.eventBus.emit(SEARCH.SET_LISTENERS);
        // this._callbackEventListener();
    }
}