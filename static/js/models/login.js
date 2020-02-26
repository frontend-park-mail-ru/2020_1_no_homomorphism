//import {Router} from "../modules/router";

export class LoginModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            /* Дефолтные значения. Наверное, надо бы их именно здесь сохранять,
            *  чтобы после неудачного сабмита возвращать в форму
            */
            login: '',
            remember: false,
        };

        this.eventBus.on('submit', this.submit);
        this.eventBus.on('remember changed', this.data.changeRemember);
    }

    submit(values) {
        if (values.email.empty()) {
            this.eventBus.emit('invalid', {
                login: 'Введите email!',
            })
        } else if (values.password.empty()) {
            this.eventBus.emit('invalid', {
                // Ты же понимаешь, что эти ошибки будут приписаны логину?
                login: 'Введите пароль!',
            })
        }

        // Запрос в бд
        // Если что, успешная вылидация -- emit('valid', {});

        this.eventBus.emit('invalid', {
            login: 'Все огонь',
        })
    }

    changeRemember(state) {
        this.data.remember = state;
    }
}
