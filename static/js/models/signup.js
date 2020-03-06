import {Validation} from '../modules/validation.js';
import {Api} from '../modules/api.js';

/**
 * модель странички регистрации
 */
export class SignupModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('submit', this.submit.bind(this));
        this.eventBus.on('cookie fetch request', this.cookieFetch.bind(this));
    }

    /**
     * Проверка, залогинен ли пользователь
     */
    cookieFetch() {
        Api.cookieFetch()
            .then((res) => {
                this.eventBus.emit('cookie fetch response', res.ok);
            });
    }

    /**
     * отправляет форму с данными нового юзера
     * @param {Object} values
     */
    submit(values) {
        const resLogin = Validation.login(values.login);
        const resPassword = Validation.password(values.password, values.passwordConfirm, true);
        const resEmail = Validation.email(values.email);
        const errors = {};
        if (values.name === '') {
            errors.name = 'Enter your name';
        }
        if (resLogin !== '') {
            errors.login = resLogin;
        }
        if (resEmail !== '') {
            errors.email = resEmail;
        }
        if (resPassword !== '') {
            errors.password = resPassword;
        }
        if (JSON.stringify(errors) !== '{}') {
            this.eventBus.emit('invalid', errors);
        } else {
            Api.signupFetch(values.name, values.login, 'yes', values.email, values.password)
                .then((res) => {
                    if (res.ok) {
                        this.eventBus.emit('hide login, show logout', {});
                        this.eventBus.emit('redirect to main', {});
                    } else {
                        this.eventBus.emit('invalid', {global: 'Signup error'}); // TODO Обрабатывать ответ бэка
                    }
                });
        }
    }
}
