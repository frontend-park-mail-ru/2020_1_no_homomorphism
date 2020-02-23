export class SignupModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            name            : '',
            login           : '',
            email           : '',
            password        : '',
            passwordConfirm : '',
        };

        this.eventBus.on('submit', this.validate);
    }

    validate(values) {
        this.eventBus.emit('invalid', {
            name            : '',
            login           : 'Пользователь с таким логином уже существует',
            sex             : '',
            email           : '',
            password        : '',
            passwordConfirm : '',

        })
    }
}
