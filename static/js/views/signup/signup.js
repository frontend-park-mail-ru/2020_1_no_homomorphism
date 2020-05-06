import {SIGN_UP, GLOBAL, DOM} from '@libs/constants';
import template from '@views/signup/signup.tmpl.xml';
import BaseView from '@libs/base_view';
import {globalEventBus} from '@libs/eventBus';

/**
 * Вью для страницы регистрации
 */
export default class SignupView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(template);
        this.eventBus = eventBus;
        this.submit.bind(this);
        this.eventBus.on(SIGN_UP.INVALID, this.showErrors);
        this.eventBus.on(SIGN_UP.CLOSE, this.close);
    }

    /**
     * рендерит страничку регистрации
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        globalEventBus.emit(GLOBAL.COLLAPSE);
        if (document
            .getElementsByClassName(DOM.CONTENT)[0].children.length > 0) {
            document
                .getElementsByClassName(DOM.CONTENT)[0].classList.add('is-un-emphasized');
        }
        document.getElementsByClassName(DOM.NAVBAR)[0]
            .classList
            .add('is-untouchable');
        document
            .getElementsByClassName(DOM.TOP_CONTENT)[0].innerHTML = template();
        this.setEventListeners.bind(this)();
        this.setDynamicEventListeners.bind(this)();
        // globalEventBus.emit(GLOBAL.COLLAPSE);
        // if (root.children.length > 0) {
        //     if (root.firstChild.classList.contains('is-emphasized')) {
        //         root.removeChild(root.firstChild);
        //     }
        //     if (root.children.length === 2) {
        //         root.removeChild(root.lastChild);
        //     }
        //     if (root.children.length !== 0) {
        //         root.firstChild.classList.add('is-un-emphasized');
        //     }
        //     root.innerHTML += template();
        //     this.setEventListeners.bind(this)();
        //     return;
        // }
        // root.innerHTML = template();
        // this.setEventListeners.bind(this)();
    }

    /**
     * Обработчик событий
     */
    setEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.getAttribute('id') === SIGN_UP.SUBMIT) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.submit();
            }
        });
    }

    /**
     * setDynamicEventListeners
     */
    setDynamicEventListeners() {
        document.addEventListener('click', this.analyzeTouch.bind(this), {once: true});
    }

    /**
     * Определение зоны нажатия
     * @param {Event} event
     */
    analyzeTouch(event) {
        console.log('kek');
        const loginArea = document.getElementsByClassName('is-emphasized')[0];
        if (loginArea === undefined) {
            return;
        }
        const isClickInside = loginArea.contains(event.target);
        if (isClickInside) {
            this.setDynamicEventListeners();
            return;
        }
        if (document
            .getElementsByClassName(DOM.CONTENT)[0].firstChild !== null) {
            this.close();
            // document
            //     .getElementsByClassName(DOM.TOP_CONTENT)[0].innerHTML = '';
            window.history.back();
            return;
        }
        this.close();
        this.eventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
    }

    /**
     * показывает, что поля были заполнены неправильно
     * @param {Object} errors
     */
    showErrors(errors) {
        this.setDynamicEventListeners.bind(this)();
        document.getElementsByClassName('l-form')[0].style.borderColor = 'red';
        for (const key in errors) {
            if (key === 'global') {
                document.getElementById('global').innerText = errors[key];
                document.getElementById('global').style.height = '20px';
                document.getElementById('global').style.visibility = 'visible';
                document.getElementById('global').style.marginTop = '21px';
            } else {
                const message = document.getElementById(key).nextElementSibling;
                message.previousElementSibling.style.borderColor = 'red';
                message.innerText = errors[key];
                message.style.height = '15px';
                message.style.marginBottom = '10px';
                message.style.visibility = 'visible';
            }
        }
    }

    /**
     * отправляет данные формы
     */
    submit() {
        document.querySelectorAll('.l-form label').forEach((label) => {
            label.children[0].style.borderColor = '#ccc';
            label.children[1].innerText = '';
            label.children[1].style.height = '0';
            label.children[1].style.marginBottom = '0';
            label.children[1].style.visibility = 'hidden';
        });
        document.getElementById('global').style.height = '0';
        document.getElementById('global').style.visibility = 'hidden';
        document.getElementById('global').style.marginTop = '0';
        this.eventBus.emit(SIGN_UP.SUBMIT, {
            name: document.getElementById('name').value,
            login: document.getElementById('login').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            passwordConfirm: document.getElementById('password-confirm').value,
        });
    }

    /**
     * Закрытие
     */
    close() {
        document.getElementsByClassName(DOM.NAVBAR)[0].classList.remove('is-untouchable');
        document
            .getElementsByClassName(DOM.CONTENT)[0].classList.remove('is-un-emphasized');
        document
            .getElementsByClassName(DOM.TOP_CONTENT)[0].innerHTML = '';
    }
}
