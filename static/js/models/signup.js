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
        if (values.name.empty) {
            this.eventBus.emit('lol', {name: 'Введите имя'})
        } else if (values.login.empty) {
            this.eventBus.emit('lol', {login: 'Введите логин!'})
        } else if (values.email.empty) {
            this.eventBus.emit('lol', {email: 'Введите email!'})
        } else if (values.password.empty) {
                this.eventBus.emit('lol', {password: 'Введите пароль!'})
        } else if (values.password !== values.passwordConfirm) {
            this.eventBus.emit('lol', {password: 'Пароли не совпадают!'})
        } else if (resLogin !== '') {
            this.eventBus.emit('lol', {login: resLogin});
        } else if (resEmail !== '') {
            this.eventBus.emit('lol', {email: resEmail});
        } else if (resPassword !== '') {
            console.log(resPassword);
            this.eventBus.emit('lol', {password: resPassword});
        } else {
        Api.signupFetch(values.name, values.login, values.email, values.password)
            .then((res) => {
                if (res.ok) {
                    this.eventBus.emit('redirect to main', {})
                } else {
                    this.eventBus.emit('lol', {name: 'Проблемы с регистарцией'})
                }
            });
        }
    }
}
