import {Validation} from '../libs/validation.js';
import {Api} from '../libs/api.js';
import * as C from '../libs/constans.js';

/**
 * Модель настроек
 */
export class SettingsModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on(C.AVATAR_UPLOAD, this.resetAvatar.bind(this));
        this.eventBus.on(C.SUBMIT, this.submit.bind(this));
        this.eventBus.on(C.GET_USER_DATA, this.getUserData.bind(this));
        // this.eventBus.on('add outer', this.model.addOuter);
    }

    /**
     * получает данные юзера
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then((data) => {
                            this.eventBus.emit(C.RENDER_LOGGED, data);
                        });
                } else {
                    this.eventBus.emit(C.NO_ANSWER, C.URL_MAIN);
                }
            });
    }

    /**
     * обновляет аватар юзера
     */
    resetAvatar() {
        const fileAttach = document.getElementById(C.AVATAR_UPLOAD);
        const resImage = Validation
            .image(fileAttach.files[0].size, fileAttach.files[0].type
                .split('/')
                .pop()
                .toLowerCase());
        if (resImage !== '') {
            this.eventBus.emit(C.INVALID, {'avatar-upload': resImage});
        } else {
            const fData = new FormData();
            fData.append('profile_image', fileAttach.files[0], 'kek.png');
            Api.profilePhotoFetch(fData)
                .then((response) => {
                    if (response.ok) {
                        this.eventBus.emit(C.GET_USER_DATA, {});
                    }
                });
        }
    }

    /**
     * отправляет форму с  обновленными данными пользователя
     * @param {Object} values
     */
    submit(values) {
        // const validation = new Validation;
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
        if (values.password === '') {
            errors['password'] = 'Enter your password to confirm changes';
        }
        if (values.email === '') {
            errors['email'] = 'Удолять email низзя';
        } else if (resEmail !== '') {
            errors['email'] = resEmail;
        }
        if (JSON.stringify(errors) !== '{}') {
            this.eventBus.emit(C.INVALID, errors);
        } else {
            Api.profileEditFetch(values.name, values.email, values.password, values.newPassword)
                .then((res) => {
                    if (res === undefined) {
                        return;
                    }
                    if (res.ok) {
                        this.eventBus.emit(C.REDIRECT, C.URL_PROFILE_TRACKS);
                    }
                });
        }
    }
}
