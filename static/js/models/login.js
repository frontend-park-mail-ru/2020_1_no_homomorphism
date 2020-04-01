import Api from '@libs/api.js';
import Validation from '@libs/validation.js';
import {LOGIN, URL} from '@libs/constans.js';

/**
 * Модель для страницы входа
 */
export default class LoginModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(LOGIN.SUBMIT, this.submit.bind(this));
    }

    /**
     * отправка формы
     * @param {Object} values
     */
    submit(values) {
        console.log('--------SUBMIT LOGIN');
        const resLogin = Validation.login(values.login);
        const resPassword = Validation.password(values.password, values.passwordConfirm);
        const errors = {};
        if (resLogin !== '') {
            errors.login = resLogin;
        }
        if (resPassword !== '') {
            errors.password = resPassword;
        }
        if (JSON.stringify(errors) !== '{}') {
            this.eventBus.emit(LOGIN.INVALID, errors);
        } else {
            Api.loginFetch(values.login, values.password)
                .then((res) => {
                    if (res === undefined) {
                        this.eventBus.emit(LOGIN.REDIRECT, URL.MAIN);
                        return;
                    }
                    if (res.ok) {
                        this.globalEventBus.emit(LOGIN.LOGIN_SUCCESS, {});
                        this.eventBus.emit(LOGIN.REDIRECT, URL.PROFILE_TRACKS);
                    } else {
                        this.eventBus.emit(LOGIN.INVALID, {global: 'Login error'}); // TODO ошибка может быть не только такой
                    }
                });
        }
    }
}
