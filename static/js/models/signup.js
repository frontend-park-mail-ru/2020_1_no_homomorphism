import Validation from '../modules/validation.js';
import Api from "../modules/api";

export class SignupModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            /* Дефолтные значения. Наверное, надо бы их именно здесь сохранять,
            *  чтобы после неудачного сабмита возвращать в форму
            */
            name: '',
            login: '',
            email: '',
            password: '',
            passwordConfirm: '',
        };

        this.eventBus.on('submit', this.submit);
    }

    submit(values) {
        const validation = new Validation;

        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);
        const resEmail = validation.validationEmail(values.email);


        if (values.name.empty()) {
            this.eventBus.emit('invalid', 'Введите имя!')
        } else if (values.login.empty()) {
            this.eventBus.emit('invalid', 'Введите логин!')
        } else if (values.sex.empty()) {
            this.eventBus.emit('invalid', 'Укажите Ваш пол!')
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
            Api.signupFetch(values.name, values.login, values.sex, values.email, values.password)
                .then((res) => {
                    if (res.ok) {
                        this.eventBus.emit('redirect to main', 'Успешная регистрация')
                    } else {
                        this.eventBus.emit('invalid', 'Проблемы с регистарцией')
                    }
                });
        }
    }
}
