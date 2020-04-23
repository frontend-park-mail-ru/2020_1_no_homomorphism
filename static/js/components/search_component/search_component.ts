import SearchDummyComponent from '@components/search_component/search_dummy_component';
import Api from '@libs/api';
import {RESPONSE, SEARCH} from "@libs/constans";

type track = {
    id: number,
    name: string,
    artist: string,
    duration: number,
    artist_id: number,
    image: string,
    link: string,
}

type artist = {
    id: number,
    name: string,
    image: string,
    genre: string,
}

type album = {
    id: number,
    name: string,
    image: string,
    release: Date,
    artist_name: string,
    artist_id: number,
}

export default class SearchComponent {
    private input: string;
    private waitingAnswer: boolean;
    private waitingAnswerInterval: NodeJS.Timeout;
    private requestInterval: NodeJS.Timeout;
    private tracks: Array<track>;
    private albums: Array<album>;
    private artists: Array<artist>;
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
        Api.searchGet(this.input, SEARCH.AMOUNT)
            .then((res) => {
                switch (res.status) {
                    case RESPONSE.OK:
                        res.json()
                            .then((elem) => {
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