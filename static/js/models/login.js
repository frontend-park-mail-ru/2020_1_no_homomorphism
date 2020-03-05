import {Api} from '../modules/api.js';
import {Validation} from '../modules/validation.js';

/**
 * Модель для страницы входа
 */
export class LoginModel {
    /**
     * Конструктор
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
            this.eventBus.emit('invalid', errors);
        } else {
            Api.loginFetch(values.login, values.password)
                .then((res) => {
                    if (res === undefined) {
                        this.eventBus.emit('redirect to main', 'No answer from backend');
                        return;
                    }
                    if (res.ok) {
                        this.eventBus.emit('hide login, show logout', {});
                    } else {
                        this.eventBus.emit('invalid', {global: 'Login error'});
                    }
                });
        }
    }

    /* changeRemember(state) {
        this.data.remember = state;
    }*/
}
