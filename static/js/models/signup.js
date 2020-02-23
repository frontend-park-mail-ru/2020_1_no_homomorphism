export class SignupModel {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;

        eventBus.on('submit', values => this.validate(values));
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
