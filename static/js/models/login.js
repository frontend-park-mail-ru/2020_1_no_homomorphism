import Api from '@libs/api.js';
import Validation from '@libs/validation.js';
import {RESPONSE, LOGIN, URL, NAVBAR} from '@libs/constans';

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
                    switch (res.status) {
                    case RESPONSE.OK:
                        localStorage.setItem('csrfToken', res.headers.get('Csrf-Token'));
                        this.globalEventBus.emit(NAVBAR.GET_USER_DATA, {});
                        this.eventBus.emit(LOGIN.REDIRECT, URL.PROFILE_TRACKS);
                        break;
                    case RESPONSE.BAD_REQUEST:
                        this.eventBus.emit(LOGIN.INVALID, {global: 'Wrong login or password'});
                        break;
                    case RESPONSE.NO_ACCESS_RIGHT:
                        this.eventBus.emit(LOGIN.INVALID, {global: 'You are already logged in'});
                        break;
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(LOGIN.INVALID, {global: 'Errors in input data, try again'});
                        break;
                    default:
                        console.log(res);
                        console.error('I am a teapot');
                    }
                });
        }
    }
}
