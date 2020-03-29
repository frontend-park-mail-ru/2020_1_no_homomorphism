import template from './news.tmpl.xml';
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
        // root.getElementById('container').innerHTML += temp();
        document.getElementsByClassName('container')[0].innerHTML = template();
        // document.getElementById('container').innerHTML = window.fest['js/views/login.tmpl']();
    }

    // render(root) {
    //     this.element.className = 'index-page';
    //     this.tmpl = window.fest['js/views/login.tmpl']();
    //     this.element.innerHTML = this.tmpl;
    //     root.innerHTML = '';
    //     root.appendChild(this.element);
    // }
}
