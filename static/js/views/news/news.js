import template from '@views/news/news.tmpl.xml';
import '@css/base.css';

/**
 *  вью для главной
 */
export default class NewsView {
    /**
     * Конструктор
     */
    constructor() {
    }

    /**
     * рендерит главную страничку
     * @param {Object} root
     */
    render(root) {
        document.getElementsByClassName('container')[0].innerHTML = template();
    }
}