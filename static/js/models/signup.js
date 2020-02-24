export class SignupModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            /* Дефолтные значения. Наверное, надо бы их именно здесь сохранять,
            *  чтобы после неудачного сабмита возвращать в форму
            */
            name            : '',
            login           : '',
            email           : '',
            password        : '',
            passwordConfirm : '',
        };

        this.eventBus.on('submit', this.submit);
    }

    submit(values) {
        // Тут вызов валидатора. Пока заглушка
        this.eventBus.emit('invalid', {
            login           : 'Пользователь с таким логином уже существует',

        })
    }
}
