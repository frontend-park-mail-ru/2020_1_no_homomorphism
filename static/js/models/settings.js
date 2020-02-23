export class SettingsModel {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;

        eventBus.on('avatar upload', avatar => this.resetAvatar(avatar));
        eventBus.on('add outer', url => this.addOuter(url));
        eventBus.on('submit', values => this.validate(values));
    }

    resetAvatar(avatar) {
        //...
        this.eventBus.emit('new avatar', avatar);
    }

    addOuter(url) {
        //...
        this.eventBus.emit('new outer', outer);
    }

    validate(values) {
        this.eventBus.emit('invalid', {
            avatar          : '',
            birthday        : '',
            name            : '',
            email           : 'невалидный адрес',
            password        : '',
            passwordConfirm : '',
            outer           : '',
        })
    }
}
