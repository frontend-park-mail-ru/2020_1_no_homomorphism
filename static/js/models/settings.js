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
        const validation = new Validation;
        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);

        if (resLogin !== '') {
            this.eventBus.emit('invalid', {
                login: resLogin,
            })
        } else if (resPassword !== '') {
            this.eventBus.emit('invalid', {
                // Ты же понимаешь, что эти ошибки будут приписаны логину?
                login: resPassword,
            })
        } else if (!values.email.empty()) {
            this.eventBus.emit('invalid', {
                // Ты же понимаешь, что эти ошибки будут приписаны логину?
                login: 'Менять email низя',
            })
        }

        // Запрос в БД
        // Если что, успешная вылидация -- emit('valid', {});

        this.eventBus.emit('invalid', {
            email: 'Все огонь',
        })
    }
}
