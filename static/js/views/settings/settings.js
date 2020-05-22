import {SETTINGS, DOM, POPUP, LAYOUT} from '@libs/constants';
import settings from '@views/settings/settings.tmpl.xml';
import BaseView from '@libs/base_view';
import User from '@libs/user';
import PopUp from '@components/pop-up/pop-up';
import ChooseThemeComponent from '@components/choose_theme/choose_theme';
import {inputSanitize} from '@libs/input_sanitize';

/**
 * вью для настроек
 */
export default class SettingsView extends BaseView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        super(settings);
        this.eventBus = eventBus;
        this.userData = {};
        this.errors = {};
        this.chooseThemeComponent = new ChooseThemeComponent(this.submitTheme.bind(this));
        this.eventBus.on(SETTINGS.INVALID, this.showErrors.bind(this));
        this.eventBus.on(SETTINGS.RENDER_LOGGED, this.renderData.bind(this));
        this.eventBus.on(POPUP.NEW, (message) => {
            new PopUp(message);
        });
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.setData({mobile: window.matchMedia(LAYOUT.MOBILE).matches});
        super.render(document.getElementsByClassName(DOM.CONTENT)[0]);
        this.chooseThemeComponent.render();
        this.eventBus.emit(SETTINGS.GET_USER_DATA);
        if (User.token === undefined) {
            this.eventBus.emit(SETTINGS.GET_CSRF_TOKEN);
        }
        this.setEventListeners();
    }

    /**
     * слушатель событий для аватарки
     */
    setEventListeners() {
        const button = document.getElementById('submit-setting-changes-data');
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.hideErrors();
            this.submitData();
        });
        const buttonPas = document.getElementById('submit-setting-changes-pass');
        buttonPas.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.hideErrors();
            this.submitPassword();
        });
        const fileAttach = document.getElementById('avatar-upload');
        fileAttach.addEventListener('change', (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.hideErrors();
            this.eventBus.emit(SETTINGS.AVATAR_UPLOAD);
        });
    }

    /**
     * слушатель событий для аватарки
     * @param {Object} data
     */
    renderData(data) {
        this.userData = data;
        document.getElementsByClassName('m-round-image')[0].src = data.image;
        document.getElementsByClassName('m-top-name')[0].innerHTML = inputSanitize(data.name);
        document.getElementsByClassName('m-top-login')[0].innerHTML = inputSanitize(data.login);
        document.getElementsByClassName('m-big-input')[0].value = inputSanitize(data.name);
        document.getElementsByClassName('m-big-input')[1].value = inputSanitize(data.email);
        document.getElementById('newPassword').value = '';
        document.getElementById('newPasswordConfirm').value = '';
        document.getElementById('password').value = '';
        document.getElementById(data.theme).classList.add('is-current-theme');
    }

    /**
     * показывает, какие поля формы заполнены неправильно
     * @param {Object} errors
     */
    showErrors(errors) {
        this.errors = errors;
        for (const key in errors) {
            if ({}.hasOwnProperty.call(errors, key)) {
                const message = document.getElementById(key);
                message.innerText = errors[key];
                message.style.height = '15px';
                message.style.marginBottom = '10px';
                message.style.visibility = 'visible';
            }
        }
    }

    /**
     * не показывает, какие поля формы заполнены неправильно
     */
    hideErrors() {
        for (const key in this.errors) {
            if ({}.hasOwnProperty.call(this.errors, key)) {
                const message = document.getElementById(key);
                message.innerText = '';
                message.style.height = '0';
                message.style.marginBottom = '0';
                message.style.visibility = 'hidden';
            }
        }
    }

    /**
     * отправляет данные формы - почта или имя
     */
    submitData() {
        this.eventBus.emit(SETTINGS.SUBMIT, {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            theme: this.userData.theme,
            newPassword: '',
            newPasswordConfirm: '',
            password: '',
        });
    }

    /**
    * отправляет данные формы - тема
    */
    submitTheme() {
        this.eventBus.emit(SETTINGS.SUBMIT, {
            name: this.userData.name,
            email: this.userData.email,
            theme: document.getElementsByClassName('is-current-theme')[0].getAttribute('id'),
            newPassword: '',
            newPasswordConfirm: '',
            password: '',
        });
    }

    /**
     * отправляет данные формы - пароли
     */
    submitPassword() {
        this.eventBus.emit(SETTINGS.SUBMIT, {
            name: this.userData.name,
            email: this.userData.email,
            theme: this.userData.theme,
            newPassword: document.getElementById('newPassword').value,
            newPasswordConfirm: document.getElementById('newPasswordConfirm').value,
            password: document.getElementById('password').value,
        });
    }
}
