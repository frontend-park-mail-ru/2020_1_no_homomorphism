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
        this.eventBus.on('submit', this.submit.bind(this));
    }

    /**
     * отправка формы
     * @param values
     */
    submit(values) {
        if (values.login.empty) {
            this.eventBus.emit('invalid', 'Введите логин!')
        } else if (values.password.empty) {
            this.eventBus.emit('invalid', 'Введите пароль!')
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
                        this.eventBus.emit('invalid', 'Ошибка входа!')
                    }
                })
        }

    }

    /*changeRemember(state) {
        this.data.remember = state;
    }*/
}
