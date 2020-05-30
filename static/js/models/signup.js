import Validation from '@libs/validation';
import Api from '@libs/api';
import {SIGN_UP, RESPONSE, NAVBAR} from '@libs/constants';
import User from '@libs/user';
import {globalEventBus} from '@libs/eventBus';
import {lang} from '@libs/language';

/**
 * модель странички регистрации
 */
export default class SignupModel {
    /**
     * конструктор
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
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
            errors.name = lang.signup.errors.name;
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
            Api.signupPost(values.name, values.login, 'yes', values.email, values.password)
                .then((res) => {
                    switch (res.status) {
                    case RESPONSE.OK_ADDED:
                        this.getCsrfToken();
                        this.eventBus.emit(SIGN_UP.CLOSE);
                        globalEventBus.emit(NAVBAR.GET_USER_DATA);
                        break;
                    case RESPONSE.BAD_REQUEST:
                        this.eventBus.emit(SIGN_UP.INVALID, {global: lang.signup.errors.request});
                        break;
                    case RESPONSE.NO_ACCESS_RIGHT:
                        this.eventBus.emit(SIGN_UP.INVALID, {global: lang.signup.errors.already});
                        break;
                    case RESPONSE.EXISTS:
                        this.checkBody.bind(this)(res);
                        break;
                    case RESPONSE.SERVER_ERROR:
                        this.eventBus.emit(SIGN_UP.INVALID,
                            {global: lang.signup.errors.tryAgain});
                        break;
                    default:
                        console.log(res);
                        console.error('I am a teapot');
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
                        this.eventBus.emit(SIGN_UP.INVALID,
                            {global: lang.signup.errors.taken.both});
                        return;
                    }
                    this.eventBus.emit(SIGN_UP.INVALID, {global: lang.signup.errors.taken.login});
                } else {
                    this.eventBus.emit(SIGN_UP.INVALID, {global: lang.signup.errors.taken.email});
                }
            });
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
