import SearchDummyComponent from '@components/search/search_dummy';
import Api from '@libs/api';
import {GLOBAL, RESPONSE, SEARCH} from '@libs/constants';
import {globalEventBus} from '@libs/eventBus';

type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
};

export default class SearchComponent {
    private input: string;
    private waitingAnswer: boolean;
    private isOpen: boolean;
    private requestInterval: NodeJS.Timeout;
    private dummySearch: SearchDummyComponent;

    constructor() {
        GLOBAL.HREF = 'global-href-checked';
        globalEventBus.on(GLOBAL.REDIRECT, this.close.bind(this));
        globalEventBus.on(GLOBAL.HREF, this.close.bind(this));
        this.dummySearch = new SearchDummyComponent(this.getIdByClick.bind(this));
        this.waitingAnswer = false;
        this.isOpen = false;
    }
    render(input: string): void {
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

    getData(): void {
        this.waitingAnswer = false;
        Api.searchGet(this.input, SEARCH.AMOUNT_TOP)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((elem) => {
                            elem.input = this.input;
                            this.isOpen = true;
                            this.dummySearch.render(elem);
                        });
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }

    getIdByClick(event: HTMLElementEvent<HTMLTextAreaElement>,
        tracks: [{ [index: string]: string }]): void {
        let current = event.target;
        while (!current.classList.contains('l-search-tracks')) {
            if (current.classList.contains('m-small-track') &&
                current.getAttribute('t-id') !== null) {
                tracks.forEach((elem) => {
                    if (elem.id === current.getAttribute('t-id')) {
                        this.getTrackInfo(elem.id);
                    }
                });
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            current = current.parentNode;
        }
    }

    getTrackInfo(id: string): void {
        Api.trackGet(id)
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((elem) => {
                            globalEventBus.emit(GLOBAL.PLAY_TRACKS, {
                                tracks: [elem],
                            }, elem.id);
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
    close(): void {
        if (this.isOpen) {
            document.getElementsByClassName('l-top-content')[0]
                .removeChild(document.getElementsByClassName('l-top-content')[0].firstChild);
            this.isOpen = false;
            (document.getElementsByClassName('m-search-input')[0] as HTMLInputElement).value = '';
        }
    }
}
