import Validation from '@libs/validation.js';
import Api from '@libs/api.js';
import {SETTINGS, URL} from '@libs/constans.js';
import {RESPONSE, SIGN_UP, NAVBAR} from '@libs/constans';

/**
 * Модель настроек
 */
export default class SettingsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.globalEventBus = globalEventBus;
        this.eventBus = eventBus;
        this.eventBus.on(SETTINGS.AVATAR_UPLOAD, this.resetAvatar.bind(this));
        this.eventBus.on(SETTINGS.SUBMIT, this.submit.bind(this));
        this.eventBus.on(SETTINGS.GET_USER_DATA, this.getUserData.bind(this));
    }

    /**
     * получает данные юзера
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(SETTINGS.RENDER_LOGGED, data);
                        });
                    break;
                case RESPONSE.UNAUTH:
                    this.eventBus.emit(SETTINGS.NO_ANSWER, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    break;
                default:
                    console.error('I am a teapot');
                }
            });
    }

    /**
     * обновляет аватар юзера
     */
    resetAvatar() {
        const fileAttach = document.getElementById(SETTINGS.AVATAR_UPLOAD);
        const resImage = Validation
            .image(fileAttach.files[0].size, fileAttach.files[0].type
                .split('/')
                .pop()
                .toLowerCase());
        if (resImage !== '') {
            this.eventBus.emit(SETTINGS.INVALID, {'avatar-upload': resImage});
        } else {
            const fData = new FormData();
            fData.append('profile_image', fileAttach.files[0], 'kek.png');
            Api.profilePhotoFetch(fData)
                .then((res) => {
                    switch (res.status) {
                    case RESPONSE.OK:
                        this.getUserData.bind(this)();
                        this.globalEventBus.emit(NAVBAR.GET_USER_DATA);
                        break;
                    case RESPONSE.BAD_REQUEST: // TODO Обработать ошибку
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    case RESPONSE.UNAUTH:
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(SETTINGS.INVALID);
                        break;
                    default:
                        console.error('I am a teapot');
                    }
                });
        }
    }

    /**
     * отправляет форму с  обновленными данными пользователя
     * @param {Object} values
     */
    submit(values) {
        const resPassword = Validation.password(
            values.newPassword,
            values.newPasswordConfirm,
            values.newPassword !== '',
        );
        const resEmail = Validation.email(values.email);

        const errors = {};
        if (values.newPassword !== '' && resPassword !== '') {
            errors['newPassword'] = resPassword;
        }
        if (resEmail !== '') {
            errors['email'] = resEmail;
        }
        if (values.name === '') {
            errors['name'] = 'Enter name';
        }
        if (JSON.stringify(errors) !== '{}') {
            this.eventBus.emit(SETTINGS.INVALID, errors);
        } else {
            Api.profileEditFetch(values.name, values.email, values.password, values.newPassword)
                .then((res) => {
                    switch (res.status) {
                    case RESPONSE.OK:
                        this.getUserData.bind(this)();
                        break;
                    case RESPONSE.BAD_REQUEST: // TODO Обработать ошибку
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    case RESPONSE.UNAUTH:
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    case RESPONSE.EXISTS:
                        errors['email'] = 'This email is taken';
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    default:
                        console.error('I am a teapot');
                    }
                });
        }
    }
}
