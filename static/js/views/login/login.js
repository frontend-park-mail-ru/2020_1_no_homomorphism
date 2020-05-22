import {LOGIN, GLOBAL, DOM} from '@libs/constants';
import template from '@views/login/login.tmpl.xml';
import BaseView from '@libs/base_view';
import {globalEventBus} from '@libs/eventBus';
import TopFormComponent from '@components/top_form/top_form';

/**
 *  вью для входа
 */
export default class LoginView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(template);
        this.form = new TopFormComponent(eventBus, LOGIN);
        this.eventBus = eventBus;
    }

    /**
     * рендерит страничку входа
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
     * setEventListeners
     */
    setEventListeners() {
        document.getElementById('submit-login').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.submit();
        });
    }

    /**
     * отправляет данные формы
     */
    submit() {
        this.form.hideErrors();
        this.eventBus.emit(LOGIN.SUBMIT, {
            login: document.getElementById('login').value,
            password: document.getElementById('password').value,
        });
    }
}
