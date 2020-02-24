export class LoginModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            /* Дефолтные значения. Наверное, надо бы их именно здесь сохранять,
            *  чтобы после неудачного сабмита возвращать в форму
            */
            login    : '',
            password : '',
            remember : false,
        };

        this.eventBus.on('submit', this.submit);
        this.eventBus.on('remember changed', this.data.changeRemember);
    }

    submit(values) {
        // Тут вызов валидатора. Пока заглушка
        this.eventBus.emit('invalid', {
            login    : 'Пользователь с таким логином не найден',
        })
    }

    changeRemember(state) {
        this.data.remember = state;
    }
}
