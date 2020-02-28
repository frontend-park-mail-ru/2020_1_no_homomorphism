import {Validation} from '../modules/validation.js';
import {Api} from "../modules/api.js";

export class SignupModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('submit', this.submit.bind(this));
    }

    submit(values) {
        const validation = new Validation;
        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);
        const resEmail = validation.validationEmail(values.email);

        if (values.name.empty) {
            this.eventBus.emit('invalid', {name: 'Введите имя'})
        } else if (resLogin !== '') {
            this.eventBus.emit('invalid', {login: resLogin});
        } else if (resEmail !== '') {
            this.eventBus.emit('invalid', {email: resEmail});
        } else if (resPassword !== '') {
            console.log('Введите корреткный пароль');
            this.eventBus.emit('invalid', {password: resPassword});
        } else {
            Api.signupFetch(values.name, values.login, '' , values.email, values.password)
            .then((res) => {
                if (res === undefined) {
                    console.log('NO ANSWER FROM BACKEND');
                } else if (res.ok) {
                    this.eventBus.emit('hide login, show logout', {});
                    this.eventBus.emit('redirect to main', {})
                } else {
                    this.eventBus.emit('invalid', {name: 'Проблемы с регистарцией'})
                }
            });
        }
    }
}
