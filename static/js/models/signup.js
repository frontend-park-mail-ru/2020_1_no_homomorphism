import {Validation} from '../libs/validation.js';
import {Api} from '../libs/api.js';

/**
 * модель странички регистрации
 */
export class SignupModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on('submit', this.submit.bind(this));
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
                        this.globalEventBus.emit('login', {});
                        this.eventBus.emit('redirect', '/');
                    } else {
                        this.eventBus.emit('invalid', {global: 'Signup error'});
                    }
                });
        }
    }
}
