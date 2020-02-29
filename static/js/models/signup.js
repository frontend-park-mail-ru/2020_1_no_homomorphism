import {Validation} from '../modules/validation.js';
import {Api} from "../modules/api.js";

/**
 * модель странички регистрации
 */
export class SignupModel {
    /**
     * конструктор
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('submit', this.submit.bind(this));
    }

    /**
     * отправляет форму с данными нового юзера
     * @param values
     */
    submit(values) {
        const validation = new Validation;

        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);
        const resEmail = validation.validationEmail(values.email);

        let errors = {};
        if (values.name === '') {
            errors['name'] = 'Введите имя';
        }
        if (resLogin !== '') {
            errors['login'] = resLogin;
        }
        if (resEmail !== '') {
            errors['email'] = resEmail;
        }
        if (resPassword !== '') {
            console.log('Введите корреткный пароль');
            errors['password'] = resPassword;
            errors['password-confirm'] = resPassword;
        }
        if (JSON.stringify(errors) != '{}') {
            this.eventBus.emit('invalid', errors);
        } else {
            Api.signupFetch(values.name, values.login, 'yes' , values.email, values.password)
            .then((res) => {
                if (res === undefined) {
                    console.log('NO ANSWER FROM BACKEND');
                } else if (res.ok) {
                    this.eventBus.emit('hide login, show logout', {});
                    this.eventBus.emit('redirect to main', {})
                } else {
                    this.eventBus.emit('invalid', {global: 'Проблемы с регистарцией'})
                }
            });
        }
    }
}
