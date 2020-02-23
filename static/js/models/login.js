export class LoginModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            login    : '',
            password : '',
            remember : false,
        };

        this.eventBus.on('submit', this.validate);
        this.eventBus.on('remember changed', this.data.changeRemember);
    }

    validate(values) {
        this.eventBus.emit('invalid', {
            login    : 'Пользователь с таким логином не найден',
            password : '',
        })
    }

    changeRemember(state) {
        this.data.remember = state;
    }
}
