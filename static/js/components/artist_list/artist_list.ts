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
    list: [artist];
};

export default class ArtistListComponent {
    private eventBus: EventBus;
    private artistListDummy: ArtistListDummyComponent;
    private artistList: [artist];
    private message: string;

    constructor(eventBus: EventBus, renderMessage: string, emergingRenderMessage: string) {
        this.eventBus = eventBus;
        this.artistListDummy = new ArtistListDummyComponent();
        this.eventBus.on(renderMessage, this.render.bind(this));
        this.message = emergingRenderMessage;
    }

    render(data: input): void {
        this.artistListDummy.DOMItem = data.domItem;
        this.artistList = data.list;
        this.eventBus.emit(this.message,
        {
            domItem: data.domItem,
            caption: data.caption,
            node: this.artistListDummy.render(this.artistList),
            ok: data.list.length > 0,
        }
        );
    }
}
