import {SETTINGS, DOM} from '@libs/constans.js';
import settings from '@views/settings/settings.tmpl.xml';
import BaseView from '@libs/base_view';

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
        this.eventBus.on(SETTINGS.INVALID, this.showErrors.bind(this));
        this.eventBus.on(SETTINGS.RENDER_LOGGED, this.renderData.bind(this));
        // this.eventBus.on(SETTINGS.AVATAR_UPLOAD, this.previewFile.bind(this));
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.CONTENT)[0]);
        if (JSON.stringify(this.userData) === '{}') { // TODO синглтон
            this.eventBus.emit(SETTINGS.GET_USER_DATA);
        } else {
            this.renderData(this.userData);
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
            this.eventBus.emit(SETTINGS.AVATAR_UPLOAD);
        });
    }

    /**
     * слушатель событий для аватарки
     * @param {Object} data
     */
    renderData(data) {
        this.userData = data;
        document.getElementsByClassName(' m-round-image')[0].src = data.image;
        document.getElementsByClassName('m-top-name')[0].innerHTML = data.name;
        document.getElementsByClassName('m-top-login')[0].innerHTML = data.login;
        document.getElementsByClassName('m-settings-input')[0].value = data.name;
        document.getElementsByClassName('m-settings-input')[1].value = data.email;
    }

    /**
     * показывает, какие поля формы заполнены неправильно
     * @param {Object} errors
     */
    showErrors(errors) { // TODO починить вывод ошибок
        this.errors = errors;
        console.log('kek');
        if (JSON.stringify(this.errors) === '{}') {
            document.getElementById('newPassword').value = '';
            document.getElementById('newPasswordConfirm').value = '';
            document.getElementById('password').value = '';
        }
        // eslint-disable-next-line guard-for-in
        for (const key in errors) {
            const message = document.getElementById(key).nextElementSibling;
            message.innerText = errors[key];
            message.style.height = '15px';
            message.style.marginBottom = '10px';
            message.style.visibility = 'visible';
        }
    }

    /**
     * показывает, какие поля формы заполнены неправильно
     */
    hideErrors() {
        console.log(this.errors);
        // eslint-disable-next-line guard-for-in
        for (const key in this.errors) {
            const message = document.getElementById(key).nextElementSibling;
            message.innerText = '';
            message.style.height = '0';
            message.style.marginBottom = '0';
            message.style.visibility = 'hidden';
        }
    }

    /**
     * отправляет данные формы - почти или имя
     */
    submitData() {
        this.eventBus.emit(SETTINGS.SUBMIT, {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            newPassword: '',
            newPasswordConfirm: '',
            password: '',
        });
    }

    /**
     * отправляет данные формы - пароли
     */
    submitPassword() {
        console.log(this.userData);
        this.eventBus.emit(SETTINGS.SUBMIT, {
            name: this.userData.name,
            email: this.userData.email,
            newPassword: document.getElementById('newPassword').value,
            newPasswordConfirm: document.getElementById('newPasswordConfirm').value,
            password: document.getElementById('password').value,
        });
    }

    /**
     * Предпросмотр фоточки
     */
    previewFile() {
        const preview = document.querySelector('. m-round-image');
        const file = document.querySelector('input[type=file]').files[0];
        const reader = new FileReader();

        reader.onloadend = function() {
            preview.src = reader.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
        }
    }
}
