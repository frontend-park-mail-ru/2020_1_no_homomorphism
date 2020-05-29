import {SETTINGS, DOM, POPUP, LAYOUT, THEME, THEME_OVERLAY, GLOBAL} from '@libs/constants';
import settings from '@views/settings/settings.tmpl.xml';
import BaseView from '@libs/base_view';
import User from '@libs/user';
import PopUp from '@components/pop-up/pop-up';
import {inputSanitize} from '@libs/input_sanitize';
import {globalEventBus} from '@libs/eventBus';

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
        this.eventBus.on(POPUP.NEW, (message, error = false) => {
            new PopUp(message, error);
        });
    }

    /**
     * Рендер
     * @param {Object} root
     * @param {string} url
     */
    render(root, url) {
        globalEventBus.emit(GLOBAL.COLLAPSE_IF_MOBILE);
        const data = {};
        data.themes = [];
        for (const i in THEME) {
            if (!{}.hasOwnProperty.call(THEME, i)) {
                continue;
            }
            data.themes.push({
                name: i[0].toUpperCase() + i.slice(1, i.length),
                themes: [],
            });
            for (const j in THEME[i]) {
                if (!{}.hasOwnProperty.call(THEME[i], j)) {
                    continue;
                }
                data.themes[data.themes.length - 1].themes.push({
                    name: i + ' ' + j,
                    general: THEME_OVERLAY[i],
                    color: THEME[i][j][1][1],
                });
            }
        }
        data.mobile = window.matchMedia(LAYOUT.MOBILE).matches;
        super.setData(data);
        super.render(document.getElementsByClassName(DOM.CONTENT)[0]);
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
        document.getElementsByClassName('m-theme-selector-container-name').forEach((elem) => {
            elem.addEventListener('click', (event) => {
                event.target.parentNode.nextSibling.firstChild.classList.toggle('is-expanded');
                event.target.nextSibling.classList.toggle('is-expanded');
            });
        });
        document.getElementsByClassName('m-theme-selector-container-button').forEach((elem) => {
            elem.addEventListener('click', (event) => {
                event.target.parentNode.nextSibling.firstChild.classList.toggle('is-expanded');
                event.target.classList.toggle('is-expanded');
            });
        });
        document.getElementsByClassName('m-theme-big').forEach((elem) => {
            elem.addEventListener('click', (event) => {
                const target = document.getElementsByClassName('m-theme-big').find((elem) => {
                    return elem.contains(event.target);
                });
                if (document.getElementsByClassName('is-current-theme')[0]) {
                    document.getElementsByClassName('is-current-theme')[0].classList
                        .remove('is-current-theme');
                }
                target.classList.add('is-current-theme');
                const split = target.getAttribute('id').split(' ');
                document.documentElement.setAttribute('theme', split[0]);
                if (split[0] === 'special') {
                    document.documentElement.setAttribute('theme-name', split[1]);
                } else {
                    document.documentElement.removeAttribute('theme-name');
                }
                // document.documentElement.removeAttribute('theme-name');
                THEME[split[0]][split[1]].forEach((prop) => {
                    document.documentElement.style.setProperty(prop[0], prop[1]);
                });
                this.submitTheme();
            });
        });
        document.getElementsByClassName('m-big-input').forEach((input) => {
            input.addEventListener('keyup', (event) => {
                if (event.keyCode === 13) {
                    let next = event.target.parentElement.parentElement.parentElement.nextSibling
                        .firstChild;
                    if (next.nodeName === 'BUTTON') {
                        event.target.blur();
                        next.click();
                    } else {
                        next = next.lastChild.firstChild;
                        next.focus();
                    }
                }
            });
        });
    }

    /**
     * слушатель событий для аватарки
     * @param {Object} data
     */
    renderData(data) {
        this.userData = data;
        document.getElementsByClassName('m-round-image')[0].src = data.image;
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
            if (!{}.hasOwnProperty.call(errors, key)) {
                continue;
            }
            const message = document.getElementById(key);
            message.innerText = errors[key];
            message.style.height = '15px';
            message.style.marginBottom = '10px';
            message.style.visibility = 'visible';
        }
    }

    /**
     * не показывает, какие поля формы заполнены неправильно
     */
    hideErrors() {
        for (const key in this.errors) {
            if (!{}.hasOwnProperty.call(this.errors, key)) {
                continue;
            }
            const message = document.getElementById(key);
            message.innerText = '';
            message.style.height = '0';
            message.style.marginBottom = '0';
            message.style.visibility = 'hidden';
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
