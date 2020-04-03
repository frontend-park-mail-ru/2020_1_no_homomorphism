import artist from '@views/artist/artist.tmpl.xml';
import BaseView from '@libs/base_view';
import {ARTIST, DOM} from '@libs/constans';
import '@css/base.css';

/**
 *  вью для страницы артиста
 */
export default class ArtistView extends BaseView {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(artist);
        this.eventBus = eventBus;
    }

    /**
     * Рендер
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.CONTENT)[0], url);
        if (JSON.stringify(this.data) === '{}') {
            this.eventBus.emit(ARTIST.GET_DATA);
        }
        /*this.eventBus.emit(PROFILE.CHOOSE_SECTION);
        this.eventBus.emit(this.currentOpen);*/
    }

    /**
     * Рендер
     */
    renderData(data) {
        this.setData(data);
        document.getElementsByClassName('m-top-login')[0].innerHTML = data.name;
        document.getElementsByClassName('m-round-image')[0].src = data.image;
    }

    setData(data) {
        super.setData(data);
    }
}
