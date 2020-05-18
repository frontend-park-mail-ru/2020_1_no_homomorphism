import {SIGN_UP, GLOBAL, DOM} from '@libs/constants';
import template from '@views/signup/signup.tmpl.xml';
import BaseView from '@libs/base_view';
import {globalEventBus} from '@libs/eventBus';
import TopFormComponent from '@components/top_form/top_form';

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
        this.form = new TopFormComponent(eventBus, SIGN_UP);
    }

    /**
     * рендерит страничку регистрации
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.TOP_CONTENT)[0], url);
        globalEventBus.emit(GLOBAL.COLLAPSE);
        this.form.configure();
        this.setEventListeners.bind(this)();
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
     * отправляет данные формы
     */
    submit() {
        this.form.hideErrors();
        this.eventBus.emit(SIGN_UP.SUBMIT, {
            name: document.getElementById('name').value,
            login: document.getElementById('login').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            passwordConfirm: document.getElementById('password-confirm').value,
        });
    }
}
