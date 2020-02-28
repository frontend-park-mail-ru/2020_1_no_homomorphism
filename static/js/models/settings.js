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
        this.eventBus.on('avatar upload', this.resetAvatar.bind(this));
        //this.eventBus.on('add outer', this.addOuter.bind(this));
        this.eventBus.on('submit', this.submit.bind(this));
        this.eventBus.on('get user data', this.getUserData.bind(this));
    }

    /**
     * получает данный юзера
     */
    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res.ok) {
                    res.text()
                        .then((data) => {
                            //this.eventBus.emit('show profile settings', data);
                            this.eventBus.emit('user data', JSON.parse(data));
                        })
                } else {
                    this.eventBus.emit('invalid', 'Ошибка загрузки профиля')
                }
            })
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
        Api.profilePhotoFetch()
            .then((response) => {
                if (response.ok) {
                    this.eventBus.emit('redirect to profile', {});
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

        if (values.newPassword !== '' && resPassword !== '') {
            this.eventBus.emit('invalid', {
                newPassword: resPassword,
            });
            return;
        } else if (values.email === '') {
            this.eventBus.emit('invalid', {
                email: 'Удолять email низзя',
            });
        } else if (resEmail !== '') {
            this.eventBus.emit('invalid', {
                email: resEmail,
            });
        }
        Api.profileEditFetch(values.name, values.email, values.password, values.newPassword)
            .then((response) => {
                if (response.ok) {
                    this.eventBus.emit('redirect to profile', {});
                }
            });
    }
}
