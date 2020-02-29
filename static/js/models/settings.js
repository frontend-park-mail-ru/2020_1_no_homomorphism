import {Validation} from '../modules/validation.js';
import {Api} from "../modules/api.js";

/**
 * Модель настроек
 */
export class SettingsModel {
    /**
     * конструктор
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    /**
     * получает данный юзера
     */
    getUserData() {
        Api.profileFetch()
        .then((res) => {
            if (res === undefined) {
                console.log('NO ANSWER FROM BACKEND');
            } else if (res.ok) {
                res.text()
                .then((data) => {
                    this.eventBus.emit('user data', JSON.parse(data));
                });
            } else {
                this.eventBus.emit('invalid', 'Ошибка загрузки профиля');
            }
        });
    }

    /**
     * обновляет аватар юзера
     */
    resetAvatar() {
        console.log('CAME TO ADD');
        const fileAttach = document.getElementById('avatar-upload');
        console.log("File size:" + fileAttach.files[0].size);
        const fData = new FormData();
        fData.append('profile_image', fileAttach.files[0], 'kek.png');
        Api.profilePhotoFetch(fData)
        .then((response) => {
            if (response.ok) {
                this.eventBus.emit('get user data', {});
            }
        });

    }

    /**
     * отправляет форму с  обновленными данными пользователя
     * @param values
     */
    submit(values) {
        const validation = new Validation;
        const resPassword = validation.validationPassword(values.newPassword, values.newPasswordConfirm);
        const resEmail = validation.validationEmail(values.email);

        let errors = {};
        if (values.newPassword !== '' && resPassword !== '') {
            errors['newPassword'] = resPassword;
            errors['newPasswordConfirm'] = resPassword;
        }
        if (values.email === '') {
                errors['email'] = 'Удолять email низзя';
        } else if (resEmail !== '') {
                errors['email'] = resEmail;
        }
        if (JSON.stringify(errors) !== '{}') {
            this.eventBus.emit('invalid', errors);
        } else {
            Api.profileEditFetch(values.name, values.email, values.password, values.newPassword)
            .then((res) => {
                if (res === undefined) {
                    console.log('NO ANSWER FROM BACKEND');
                    return;
                }
                if (res.ok) {
                    this.eventBus.emit('redirect to profile', {});
                }
            });
        }
    }
}
