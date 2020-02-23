export class LoginModel {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;

        eventBus.on('submit', values => this.validate(values));
        eventBus.on('remember checked', checked => this.elements.remember = checked)
    }

    validate(values) {
        this.eventBus.emit('invalid', {
            'login'    : 'Пользователь с таким логином не найден',
            'password' : '',
        })
    }
}
