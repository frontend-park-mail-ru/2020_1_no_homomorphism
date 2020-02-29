import {Api} from '../modules/api.js';
import {Validation} from '../modules/validation';

/**
 * Модель для страницы входа
 */
export class LoginModel {
    /**
     * Конструктор
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    /**
     * отправка формы
     * @param values
     */
    submit(values) {

        const validation = new Validation;

        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);

        let errors = {};
        if (resLogin !== '') {
            errors['login'] = resLogin;
        } else if (resPassword !== '') {
            errors['password'] = resPassword;
        }
        if (errors.size !== 0) {
            this.eventBus.emit('invalid', errors);
        } else {
            Api.loginFetch(values.login, values.password)
                .then((res) => {
                    if (res === undefined) {
                        console.log('NO ANSWER FROM BACKEND');
                        this.eventBus.emit('redirect to main', 'No answer from backend');
                        return;
                    }
                    if (res.ok) {
                        console.log('SUCCESS');
                        this.eventBus.emit('hide login, show logout', {});
                    } else {
                        console.log('ENTRY ERROR');
                        this.eventBus.emit('invalid', 'Login Error'); // TODO Обработка ответа Бэкэнда
                    }
                });
        }

    }

    /*changeRemember(state) {
        this.data.remember = state;
    }*/
}
