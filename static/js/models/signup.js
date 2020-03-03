import {Validation} from '../modules/validation.js';
import {Api} from '../modules/api.js';

/**
 * модель странички регистрации
 */
export class SignupModel {
    /**
     * конструктор
     * @param eventBus {EventBus}
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on('submit', this.submit.bind(this));
    }

    /**
     * отправляет форму с данными нового юзера
     * @param values
     */
    submit(values) {
        const validation = new Validation;

        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm, true);
        const resEmail = validation.validationEmail(values.email);

        let errors = {};
        if (values.name === '') {
            errors['name'] = 'Enter your name';
        }
        if (resLogin !== '') {
            errors['login'] = resLogin;
        }
        if (resEmail !== '') {
            errors['email'] = resEmail;
        }
        if (resPassword !== '') {
            errors['password'] = resPassword;
        }
        if (JSON.stringify(errors) !== '{}') {
            this.eventBus.emit('invalid', errors);
        } else {
            Api.signupFetch(values.name, values.login, 'yes', values.email, values.password)
            .then((res) => {
                if (res === undefined) {
                    console.log('NO ANSWER FROM BACKEND');
                } else if (res.ok) {
                    this.globalEventBus.emit('login', {});
                    this.eventBus.emit('redirect to main', {});
                } else {
                    this.eventBus.emit('invalid', {global: 'Signup error'}); // TODO Обрабатывать ответ бэка
                }
            });
        }
    }
}
