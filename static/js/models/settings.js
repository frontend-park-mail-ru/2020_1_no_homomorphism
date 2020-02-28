import {Validation} from '../modules/validation.js';
import {Api} from "../modules/api.js";

export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('avatar upload', this.resetAvatar.bind(this));
        this.eventBus.on('submit', this.submit.bind(this));
        this.eventBus.on('get user data', this.getUserData.bind(this));
    }

    getUserData() {
        Api.profileFetch()
            .then((res) => {
                if (res === undefined) {
                    console.log('NO ANSWER FROM BACKEND');
                } else if (res.ok) {
                    res.text()
                        .then((data) => {
                            this.eventBus.emit('user data', JSON.parse(data));
                        })
                } else {
                    this.eventBus.emit('invalid', 'Ошибка загрузки профиля')
                }
            })
    }

    resetAvatar() {
        console.log('CAME TO ADD');
        const fileAttach = document.getElementById('avatar-upload');
        const fData = new FormData();
        fData.append('profile_image', fileAttach.files[0], 'kek.png');
        Api.profilePhotoFetch(fData)
            .then((response) => {
                if (response.ok) {
                    this.eventBus.emit('redirect to profile', {});
                }
            });

    }

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
