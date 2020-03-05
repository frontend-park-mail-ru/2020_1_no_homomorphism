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
        this.eventBus.on('submit', this.submit.bind(this));
        this.eventBus.on('get user data', this.getUserData.bind(this));
        //this.eventBus.on('add outer', this.model.addOuter);
        this.eventBus.on('cookie fetch request', this.cookieFetch.bind(this));
    }

    cookieFetch() {
        Api.cookieFetch()
        .then((res) => {
            this.eventBus.emit('cookie fetch response', res.ok);
        });
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
                res.json()
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
        const fileAttach = document.getElementById('avatar-upload');
	const validation = new Validation;
	const resImage = validation.validationImage(fileAttach.files[0].size, fileAttach.files[0].type.split('/').pop().toLowerCase());
	if (resImage !== '') {
	    console.log('WRONG FORMAT'); // TODO добавить обработку ошибочки
	    this.eventBus.emit('invalid', resImage);
	} else {
	    console.log('UPLOADED');
    	    const fData = new FormData();
	    fData.append('profile_image', fileAttach.files[0], 'kek.png');
            Api.profilePhotoFetch(fData)
            .then((response) => {
                if (response.ok) {
                    this.eventBus.emit('get user data', {});
                }
            });
	}
    }

    /**
     * отправляет форму с  обновленными данными пользователя
     * @param values
     */
    submit(values) {
        const validation = new Validation;
        const resPassword = validation.validationPassword(values.newPassword, values.newPasswordConfirm, values.newPassword !== '');
        const resEmail = validation.validationEmail(values.email);
        let errors = {};
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
