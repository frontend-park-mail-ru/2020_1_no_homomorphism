import Validation from '../modules/validation.js';

export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            // Такой же вопрос, как и в profile
            avatar: {},
            name: '',
            email: '',
            password: '',
            passwordConfirm: '',
            outer: [],
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
        const validation = new Validation;
        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);

        if (resLogin !== '') {
            this.eventBus.emit('invalid', {
                login: resLogin,
            })
        } else if (resPassword !== '') {
            this.eventBus.emit('invalid', {
                login: resPassword,
            })
        } else if (!values.email.empty()) {
            this.eventBus.emit('invalid', {
                login: 'Менять email низя',
            })
        }

        // Запрос в БД

        this.eventBus.emit('invalid', {
            email: 'Все огонь',
        })
    }
}

