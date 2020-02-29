import {Api} from "../modules/api.js";

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
        let errors = {};
        if (values.login.empty) {
            errors['login'] = 'Введите логин!';
        }
        if (values.password.empty) {
            errors['password'] = 'Введите пароль!';
        }
        if (JSON.stringify(errors) != '{}') {
            this.eventBus.emit('invalid', errors);
        } else {
            Api.loginFetch(values.login, values.password)
            .then((res)=> {
                if (res === undefined){
                    console.log('NO ANSWER FROM BACKEND');
                    this.eventBus.emit('redirect to main', 'Ошибка загрузки логина');
                    return
                }
                if (res.ok) {
                    console.log('SUCCESS');
                    this.eventBus.emit('hide login, show logout', {});
                } else {
                    console.log('ENTRY ERROR');
                    this.eventBus.emit('invalid', {global: 'Ошибка входа!'});
                }
            });
        }

    }

    /*changeRemember(state) {
        this.data.remember = state;
    }*/
}
