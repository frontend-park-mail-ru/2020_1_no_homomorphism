import SearchDummyComponent from '@components/search_component/search_dummy_component';
import Api from '@libs/api';
import {RESPONSE, SEARCH} from "@libs/constans";

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
}