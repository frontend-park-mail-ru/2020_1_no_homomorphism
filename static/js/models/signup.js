import {Validation} from '../libs/validation.js';
import {Api} from '../libs/api.js';
import * as C from '../libs/constans.js';

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
        this.eventBus.on(C.SUBMIT, this.submit.bind(this));
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
            this.eventBus.emit(C.INVALID, errors);
        } else {
            Api.signupFetch(values.name, values.login, 'yes', values.email, values.password)
                .then((res) => {
                    if (res.ok) {
                        this.globalEventBus.emit(C.LOGIN_SUCCESS, {});
                        this.eventBus.emit(C.REDIRECT, '/');
                    } else {
                        this.eventBus.emit(C.INVALID, {global: 'Signup error'});
                    }
                });
        }
    }
}
