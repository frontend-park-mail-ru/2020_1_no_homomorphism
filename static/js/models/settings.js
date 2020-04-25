import Validation from '@libs/validation';
import Api from '@libs/api';
import {SETTINGS, URL, RESPONSE, NAVBAR, GLOBAL} from '@libs/constans';
import User from '@libs/user';
import {globalEventBus} from '@libs/eventBus';

/**
 * Модель настроек
 */
export default class SettingsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(SETTINGS.AVATAR_UPLOAD, this.resetAvatar.bind(this));
        this.eventBus.on(SETTINGS.SUBMIT, this.submit.bind(this));
        this.eventBus.on(SETTINGS.GET_USER_DATA, this.getUserData.bind(this));
        this.eventBus.on(SETTINGS.GET_CSRF_TOKEN, this.getCsrfToken.bind(this));
    }

    /**
     * получает данные юзера
     * @param {boolean} changeEvent были ли изменены данные
     */
    getUserData(changeEvent = false) {
        if (User.exists() && !changeEvent) {
            this.eventBus.emit(SETTINGS.RENDER_LOGGED, User.getUserData());
            return;
        }
        Api.profileGet()
            .then((res) => {
                switch (res.status) {
                case RESPONSE.OK:
                    res.json()
                        .then((data) => {
                            User.setUserData(data);
                            this.getCsrfToken();
                            this.eventBus.emit(SETTINGS.RENDER_LOGGED, User.getUserData());
                        });
                    break;
                case RESPONSE.UNAUTH:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                    break;
                case RESPONSE.SERVER_ERROR:
                    globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
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
        const fileAttach = document.getElementById('avatar-upload');
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
            Api.profileAvatarPost(fData)
                .then((res) => {
                    this.eventBus.emit(SETTINGS.GET_CSRF_TOKEN);
                    switch (res.status) {
                    case RESPONSE.OK:
                        this.getUserData.bind(this)(true);
                        globalEventBus.emit(NAVBAR.GET_USER_DATA);
                        break;
                    case RESPONSE.BAD_REQUEST: // TODO Обработать ошибку
                        this.eventBus.emit(SETTINGS.INVALID);
                        break;
                    case RESPONSE.UNAUTH:
                        globalEventBus.emit(NAVBAR.GET_USER_DATA);
                        globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                        break;
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(SETTINGS.INVALID);
                        break;
                    default:
                        console.log(res);
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
            values.password = '';
            values.newPassword = '';
            const resEmail = Validation.email(values.email);
            if (resEmail !== '') {
                errors['email'] = resEmail;
            }
            if (values.name === '') {
                errors['name'] = 'Enter name';
            }
        }
        if (JSON.stringify(errors) !== '{}') {
            this.eventBus.emit(SETTINGS.INVALID, errors);
        } else {
            Api.profilePut(values.name, values.email, values.password, values.newPassword)
                .then((res) => {
                    this.eventBus.emit(SETTINGS.GET_CSRF_TOKEN);
                    switch (res.status) {
                    case RESPONSE.OK:
                        this.getUserData.bind(this)(true);
                        break;
                    case RESPONSE.BAD_REQUEST:
                        errors['password'] = 'Wrong password';
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    case RESPONSE.UNAUTH:
                        globalEventBus.emit(GLOBAL.REDIRECT, URL.MAIN);
                        break;
                    case RESPONSE.EXISTS:
                        errors['email'] = 'This email is already taken';
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(SETTINGS.INVALID, errors);
                        break;
                    default:
                        console.log(res);
                        console.error('I am a teapot');
                    }
                });
        }
    }

    /**
     * Получение токена
     */
    getCsrfToken() {
        Api.csrfTokenGet()
            .then((res) => {
                User.token = res.headers.get('Csrf-Token');
            });
    }
}
