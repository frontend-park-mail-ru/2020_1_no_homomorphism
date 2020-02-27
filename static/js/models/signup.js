import {Validation} from '../modules/validation.js';
import {Api} from "../modules/api.js";

export class SignupModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    submit(values) {
        const validation = new Validation;

        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);
        const resEmail = validation.validationEmail(values.email);

        // TODO Переместить пустые строчки в валидацию
        if (values.name.empty()) {
            this.eventBus.emit('invalid', 'Введите имя!')
        } else if (values.login.empty()) {
            this.eventBus.emit('invalid', 'Введите логин!')
        } else if (values.email.empty()) {
            this.eventBus.emit('invalid', 'Введите email!')
        } else if (values.password.empty()) {
                this.eventBus.emit('invalid', 'Введите пароль!')
        } else if (resLogin !== '') {
            this.eventBus.emit('invalid', resLogin);
        } else if (resEmail !== '') {
            this.eventBus.emit('invalid', resEmail);
        } else if (resPassword !== '') {
            this.eventBus.emit('invalid', resPassword);
        } else {
            console.log('LOL');
            Api.signupFetch(values.name, values.login, values.email, values.password)
                .then((res) => {
                    if (res.ok) {
                        this.eventBus.emit('hide login, show logout', {});
                    } else {
                        this.eventBus.emit('invalid', 'Проблемы с регистарцией')
                    }
                });
        }
    }
}
