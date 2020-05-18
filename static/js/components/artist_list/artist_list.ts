import {RESPONSE, SEARCH, MAIN} from '@libs/constants';
import Api from "@libs/api";
import EventBus from '@libs/eventBus';
import ArtistListDummyComponent from '@components/artist_list/artist_list_dummy';

type artist = {
    id: string,
    name: string,
    image: string,
    artist_id: string,
    artist_name: string,
};

type input = {
    domItem: string,
    type: string,
    artists: [artist],
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

    render(data: input) {
        this.artistListDummy.DOMItem = data.domItem;
        this.artistList = data.artists;
        // @ts-ignore
        if (0 !== this.artistList.length) {
            this.artistListDummy.render(this.artistList);
        }
    }

    /**
     * Получает списка артистов
     */
    getArtistListData() { // TODO На будущее
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
