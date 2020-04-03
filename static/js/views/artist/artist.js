import artist from '@views/artist/artist.tmpl.xml';
import BaseView from '@libs/base_view';
import {DOM} from '@libs/constans';
import '@css/base.css';

/**
 *  вью для страницы артиста
 */
export default class ArtistView extends BaseView{
    /**
     * Конструктор
     */
    constructor() {
        super(artist)
    }

    /**
     * рендерит страницу артиста
     */
    render(root, url) {
        super.render(root);
    }
}
