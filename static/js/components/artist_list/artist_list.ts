import {RESPONSE, SEARCH} from '@libs/constants';
import Api from '@libs/api';
import EventBus from '@libs/eventBus';
import ArtistListDummyComponent from '@components/artist_list/artist_list_dummy';

type artist = {
    id: string;
    name: string;
    image: string;
    artist_id: string;
    artist_name: string;
};

type input = {
    domItem: string;
    type: string;
    artists: [artist];
};

export default class ArtistListComponent {
    private eventBus: EventBus;
    private modelType: { [index: string]: string };
    private artistListDummy: ArtistListDummyComponent;
    private artistList: [artist];

    constructor(eventBus: EventBus, modelType: { [index: string]: string }) {
        this.eventBus = eventBus;
        this.modelType = modelType;
        this.artistListDummy = new ArtistListDummyComponent();
        this.eventBus.on(SEARCH.RENDER_ARTISTS, this.render.bind(this));
    }

    render(data: input): void {
        this.artistListDummy.DOMItem = data.domItem;
        this.artistList = data.artists;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (this.artistList.length !== 0) {
            this.artistListDummy.render(this.artistList);
        }
    }

    /**
     * Получает списка артистов
     */
    getArtistListData(): void { // TODO На будущее
        Api.artistListGet('0', '100')
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(this.modelType.RENDER_ARTIST, data.artists);
                        });
                    break;
                default:
                    console.log(res);
                    console.error('I am a teapot');
                }
            });
    }
}
