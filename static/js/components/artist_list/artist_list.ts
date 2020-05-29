import EventBus from '@libs/eventBus';
import ArtistListDummyComponent from '@components/artist_list/artist_list_dummy';
import {MAIN} from '@libs/constants';

type artist = {
    id: string;
    name: string;
    image: string;
    artist_id: string;
    artist_name: string;
};

type input = {
    domItem: string;
    caption: string;
    artists: [artist];
};

export default class ArtistListComponent {
    private eventBus: EventBus;
    private artistListDummy: ArtistListDummyComponent;
    private artistList: [artist];

    constructor(eventBus: EventBus, renderMessage: string) {
        this.eventBus = eventBus;
        this.artistListDummy = new ArtistListDummyComponent();
        this.eventBus.on(renderMessage, this.render.bind(this));
    }

    render(data: input): void {
        this.artistListDummy.news = data.domItem === 'artists-section';
        this.artistListDummy.DOMItem = data.domItem;
        this.artistList = data.artists;
        this.artistListDummy.render(this.artistList);
    }
}
