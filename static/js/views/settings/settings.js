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
        this.eventBus.on(SETTINGS.INVALID, this.showErrors.bind(this));
        this.eventBus.on(SETTINGS.RENDER_LOGGED, this.renderData.bind(this));
        // this.eventBus.on(SETTINGS.AVATAR_UPLOAD, this.previewFile.bind(this));

    }

    /**
     * Рендер
     */
    render(root, url) {
        super.render(document.getElementsByClassName(DOM.CONTENT)[0]);
        if (JSON.stringify(this.userData) === '{}') {
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
            this.submit();
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
        document.getElementsByClassName('m-profile-avatar')[0].src = data.image;
        document.getElementsByClassName('m-profile-name')[0].innerHTML = data.name;
        document.getElementsByClassName('m-profile-login')[0].innerHTML = data.login;

        document.getElementsByClassName('m-settings-input')[0].value = data.name;
        document.getElementsByClassName('m-settings-input')[1].value = data.email;
    }

    /**
     * показывает, какие поля формы заполнены неправильно
     * @param {Object} errors
     */
    showErrors(errors) { //TODO починить вывод ошибок
        // eslint-disable-next-line guard-for-in
        for (const key in errors) {
            const message = document.getElementById(key).nextElementSibling;
            message.previousElementSibling.style.borderColor =
                (message.getAttribute('class').indexOf('warning') !== -1 ? '#ffae42' : 'red');
            message.innerText = errors[key];
            message.style.height = '15px';
            message.style.marginBottom = '10px';
            message.style.visibility = 'visible';
        }
    }

    /**
     * отправляет данные формы
     */
    submit() {
        document.querySelectorAll('.info input').forEach((input) => {
            input.style.borderColor = '#ccc';
            input.nextElementSibling.innerText = '';
            input.nextElementSibling.style.height = '0';
            input.nextElementSibling.style.marginBottom = '0';
            input.nextElementSibling.style.visibility = 'hidden';
        });
        this.eventBus.emit(SETTINGS.SUBMIT, {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            newPassword: document.getElementById('newPassword').value,
            newPasswordConfirm: document.getElementById('newPasswordConfirm').value,
            password: document.getElementById('password').value,
        });
    }

    /**
     * Предпросмотр фоточки
     */
    previewFile() {
        let preview = document.querySelector('.m-profile-avatar');
        let file    = document.querySelector('input[type=file]').files[0];
        let reader  = new FileReader();

        reader.onloadend = function () {
            preview.src = reader.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
    }
}
