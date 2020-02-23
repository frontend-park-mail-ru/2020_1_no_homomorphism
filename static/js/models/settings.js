export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            avatar          : {},
            name            : '',
            email           : '',
            password        : '',
            passwordConfirm : '',
            outer           : [],
        };

        this.eventBus.on('avatar upload', this.resetAvatar);
        this.eventBus.on('add outer', this.addOuter);
        this.eventBus.on('submit', this.validate);
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
