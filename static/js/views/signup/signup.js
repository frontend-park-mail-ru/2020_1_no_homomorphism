import {SIGN_UP, TEMPLATES, DOM} from '@libs/constans.js';
import signup from '@views/signup/signup.tmpl.xml';
import BaseView from '@libs/base_view';

/**
 * Вью для страницы регистрации
 */
export default class SignupView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(signup);
        this.eventBus = eventBus;
        this.submit.bind(this);
        this.eventBus.on(SIGN_UP.INVALID, this.showErrors);
    }

    /**
     * рендерит страничку регистрации
     */
    render(root, url) {
        super.render(root, url);
        this.setEventListeners();
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
     * показывает, что поля были заполнены неправильно
     * @param {Object} errors
     */
    showErrors(errors) {
        document.getElementsByClassName('sign-up-form')[0].style.borderColor = 'red';
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
        document.querySelectorAll('.sign-up-form label').forEach((label) => {
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
}
