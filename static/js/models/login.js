import {Api} from '../libs/api.js';
import {Validation} from '../libs/validation.js';
import * as C from '../libs/constans.js';

/**
 * Модель для страницы входа
 */
export class LoginModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     * @param {EventBus} globalEventBus
     */
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
        this.eventBus.on(C.SUBMIT, this.submit.bind(this));
    }

    /**
     * отправка формы
     * @param {Object} values
     */
    submit(values) {
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
            this.eventBus.emit(C.INVALID, errors);
        } else {
            Api.loginFetch(values.login, values.password)
                .then((res) => {
                    if (res === undefined) {
                        this.eventBus.emit(C.REDIRECT, C.URL_MAIN);
                        return;
                    }
                    if (res.ok) {
                        this.globalEventBus.emit(C.LOGIN_SUCCESS, {});
                        this.eventBus.emit(C.REDIRECT, C.URL_MAIN);
                    } else {
                        this.eventBus.emit(C.INVALID, {global: 'Login error'}); // TODO ошибка может быть не только такой
                    }
                });
        }
    }

    /* changeRemember(state) {
        this.data.remember = state;
    }*/
}
