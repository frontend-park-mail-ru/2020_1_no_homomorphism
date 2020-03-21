import {SETTINGS} from '../libs/constans.js';

/**
 * вью для настроек
 */
export default class SettingsView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(SETTINGS.INVALID, this.showErrors);
    }

    /**
     * слушатель событий для аватарки
     */
    setEventListeners() {
        const button = document.getElementById('submit-setting-changes-data');
        button.addEventListener('click', (event) => {
            event.preventDefault();
            this.submit();
        });
        const fileAttach = document.getElementById('avatar-upload');
        fileAttach.addEventListener('change', () => {
            this.eventBus.emit(SETTINGS.AVATAR_UPLOAD, {});
        });
    }

    /**
     * Рендер
     * @param {Object} root
     */
    render(root) {
        this.eventBus.on(SETTINGS.RENDER_LOGGED, (data) => {
            // eslint-disable-next-line no-undef
            root.innerHTML = nunjucks.render('../../../views/settings.njk', data);
            this.setEventListeners();
        });
        this.eventBus.emit(SETTINGS.GET_USER_DATA, {});
    }

    /**
     * показывает, какие поля формы заполнены неправильно
     * @param {Object} errors
     */
    showErrors(errors) {
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
}
