// import temp from './login.xml';
import '@css/base.css';

/**
 *  вью для главной
 */
export default class IndexView {
    /**
     * Конструктор
     */
    constructor() {
        this.element = document.createElement('div');
    }

    /**
     * рендерит главную страничку
     * @param {Object} root
     */
    render(root) {
        // root.getElementById('container').innerHTML += temp();
        console.log('kkk');
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
