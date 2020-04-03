import Validation from '@libs/validation.js';
import Api from '@libs/api.js';
import {SIGN_UP, URL, RESPONSE} from '@libs/constans.js';

/**
 * модель странички регистрации
 */
export default class SignupModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(SIGN_UP.SUBMIT, this.submit.bind(this));
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
            this.eventBus.emit(SIGN_UP.INVALID, errors);
        } else {
            Api.signupFetch(values.name, values.login, 'yes', values.email, values.password)
                .then((res) => {
                    switch (res.status) {
                    case RESPONSE.OK_ADDED:
                        this.globalEventBus.emit(SIGN_UP.LOGIN_SUCCESS);
                        this.eventBus.emit(SIGN_UP.REDIRECT, URL.MAIN);
                        break;
                    case RESPONSE.BAD_REQUEST:
                        this.eventBus.emit(SIGN_UP.INVALID, {global: 'Bad request'});
                        break;
                    case RESPONSE.NO_ACCESS_RIGHT:
                        this.eventBus.emit(SIGN_UP.INVALID, {global: 'You are already logged in'});
                        break;
                    case RESPONSE.EXISTS:
                        this.checkBody.bind(this)(res);
                        break;
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(SIGN_UP.INVALID, {global: 'Errors in input data, try again'});
                        break;
                    default:
                        console.log(res);
                        console.error('I am a teapot'); // В случае, если бэк - кек
                    }
                });
        }
    }

    /**
     * Определяет, каое поле занято
     * @param {Object} res
     */
    checkBody(res) {
        res.json()
            .then((body) => {
                if (body.login_exists) {
                    if (body.email_exists) {
                        this.eventBus.emit(SIGN_UP.INVALID, {global: 'These login and email are taken'});
                        return;
                    }
                    this.eventBus.emit(SIGN_UP.INVALID, {global: 'This login is taken'});
                } else {
                    this.eventBus.emit(SIGN_UP.INVALID, {global: 'This email is taken'});
                }

            });
    }
}
