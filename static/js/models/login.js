//import {Router} from "../modules/router";
import Api from "../modules/api";


export class LoginModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            login: '',
            password: '',
            remember: false,
        };
    }

    submit(values) {
        if (values.email.empty()) {
            this.eventBus.emit('invalid', 'Введите email!')
        } else if (values.password.empty()) {
            this.eventBus.emit('invalid', 'Введите пароль!')
        } else {
            Api.loginFetch(values.email, values.password)
                .then((res)=> {
                    if (res.ok) {
                        this.eventBus.emit('redirect to main', 'Успешный вход');
                    } else {
                        this.eventBus.emit('invalid', 'Ошибка входа!')
                    }
                })
        }
    }

    changeRemember(state) {
        this.data.remember = state;
    }
}
