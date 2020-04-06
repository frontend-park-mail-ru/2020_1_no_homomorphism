import Validation from '@libs/validation.js';
import Api from '@libs/api.js';
import {SETTINGS, URL, RESPONSE, NAVBAR} from '@libs/constans';

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
                            console.log(data);
                            this.eventBus.emit(SETTINGS.RENDER_LOGGED, data);
                        });
                    break;
                case RESPONSE.UNAUTH:
                    this.eventBus.emit(SETTINGS.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    this.eventBus.emit(SETTINGS.REDIRECT, URL.MAIN);
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
                        this.eventBus.emit(SETTINGS.INVALID);
                        break;
                    case RESPONSE.UNAUTH:
                        this.globalEventBus.emit(NAVBAR.GET_USER_DATA);
                        this.eventBus.emit(SETTINGS.REDIRECT);
                        break;
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
        const errors = {};
        if (values.newPassword !== '') {
            const resPassword = Validation.password(
                values.newPassword,
                values.newPasswordConfirm,
                values.newPassword !== '',
            );
            if (values.newPassword !== '' && resPassword !== '') {
                errors['newPassword'] = resPassword;
            }
            if (values.password === '') {
                errors['password'] = 'Enter old password';
            }
        } else {
            const resEmail = Validation.email(values.email);
            if (resEmail !== '') {
                errors['email'] = resEmail;
            }
            if (values.name === '') {
                errors['name'] = 'Enter name';
            }
        }
        if (JSON.stringify(errors) !== '{}') {
            console.log(errors);
            this.eventBus.emit(SETTINGS.INVALID, errors);
        } else {
            Api.profileEditFetch(values.name, values.email, values.password, values.newPassword)
                .then((res) => {
                    console.log(res);
                    switch (res.status) {
                    case RESPONSE.OK:
                        console.log('OK');
                        this.getUserData.bind(this)();
                        break;
                    case RESPONSE.BAD_REQUEST: // TODO Обработать ошибку
                        console.log('BAD_REQUEST');
                        errors['password'] = 'Wrong password';
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    case RESPONSE.UNAUTH:
                        this.eventBus.emit(SETTINGS.REDIRECT, URL.MAIN);
                        break;
                    case RESPONSE.EXISTS:
                        errors['email'] = 'This email is already taken';
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
