import Api from '@libs/api';
import Validation from '@libs/validation';
import {RESPONSE, LOGIN, NAVBAR, URL, GLOBAL} from '@libs/constans';
import User from '@libs/user';
import {globalEventBus} from '@libs/eventBus';

/**
 * Модель для страницы входа
 */
export default class LoginModel {
    /**
     * Конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
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
            Api.loginPost(values.login, values.password)
                .then((res) => {
                    switch (res.status) {
                    case RESPONSE.OK:
                        this.getCsrfToken();
                        globalEventBus.emit(NAVBAR.GET_USER_DATA);
                        globalEventBus.emit(GLOBAL.REDIRECT, URL.PROFILE_TRACKS);
                        break;
                    case RESPONSE.BAD_REQUEST:
                        this.eventBus.emit(LOGIN.INVALID, {global: 'Wrong login or password'});
                        break;
                    case RESPONSE.NO_ACCESS_RIGHT:
                        this.eventBus.emit(LOGIN.INVALID, {global: 'You are already logged in'});
                        break;
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(LOGIN.INVALID,
                            {global: 'Errors in input data, try again'});
                        break;
                    default:
                        console.log(res);
                        console.error('I am a teapot');
                    }
                });
        }
    }

    /**
     * Получение токена
     */
    getCsrfToken() {
        Api.csrfTokenGet()
            .then((res) => {
                User.token = res.headers.get('Csrf-Token');
            });
    }
}
