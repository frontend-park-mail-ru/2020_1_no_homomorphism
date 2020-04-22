import {LOGIN, GLOBAL} from '@libs/constans';
import template from '@views/login/login.tmpl.xml';
import BaseView from '@libs/base_view';

/**
 *  вью для входа
 */
export default class LoginView extends BaseView {
    /**
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        super(template);
        this.eventBus = eventBus;
        this.eventBus.on(LOGIN.INVALID, this.showErrors);
        this.globalEventBus = globalEventBus;
    }

    /**
     * рендерит страничку входа
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        this.globalEventBus.emit(GLOBAL.COLLAPSE);
        if (root.children.length > 0) {
            if (root.firstChild.classList.contains('is-emphasized')) {
                root.removeChild(root.firstChild);
            }
            if (root.children.length === 2) {
                root.removeChild(root.lastChild);
            }
            if (root.children.length !== 0) {
                root.firstChild.classList.add('is-un-emphasized');
            }
            root.innerHTML += template();
            this.setEventListeners.bind(this)();
            return;
        }
        root.innerHTML = template();
        this.setEventListeners.bind(this)();
    }

    /**
     * setEventListeners
     */
    setEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.getAttribute('id') === 'submit-login') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.submit();
            }
        });
    }

    /**
     * показывает, какие поля неверно заполнены
     * @param {Object} errors
     */
    showErrors(errors) {
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
        this.eventBus.emit(LOGIN.SUBMIT, {
            login: document.getElementById('login').value,
            password: document.getElementById('password').value,
        });
    }
}
