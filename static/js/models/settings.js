export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            // Такой же вопрос, как и в profile
            avatar          : {},
            name            : '',
            email           : '',
            password        : '',
            passwordConfirm : '',
            outer           : [],
        };

        this.eventBus.on('avatar upload', this.resetAvatar);
        this.eventBus.on('add outer', this.addOuter);
        this.eventBus.on('submit', this.submit);
    }

    /*getUserData() {
        ...
        return data;
    }*/

    resetAvatar(avatar) {
        //...
        this.eventBus.emit('new avatar', avatar);
    }

    addOuter(url) {
        //...
        this.eventBus.emit('new outer', outer);
    }

    submit(values) {
        // Тут вызов валидатора. Пока заглушка
        this.eventBus.emit('invalid', {
            email           : 'невалидный адрес',
        })
    }
}
