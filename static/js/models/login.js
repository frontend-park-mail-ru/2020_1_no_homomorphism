import {Api} from '../modules/api.js';
import {Validation} from '../modules/validation.js';

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
        this.eventBus.on('submit', this.submit.bind(this));
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
                        this.eventBus.emit('redirect', '/');
                        return;
                    }
                    if (res.ok) {
                        this.globalEventBus.emit('login', {});
                        this.eventBus.emit('redirect', '/');
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
