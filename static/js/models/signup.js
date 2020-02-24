import Validation from '../modules/validation.js';

export class SignupModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            /* Дефолтные значения. Наверное, надо бы их именно здесь сохранять,
            *  чтобы после неудачного сабмита возвращать в форму
            */
            name: '',
            login: '',
            email: '',
            password: '',
            passwordConfirm: '',
        };

        this.eventBus.on('submit', this.submit);
    }

    submit(values) {
        const validation = new Validation;

        const resLogin = validation.validationLogin(values.login);
        const resPassword = validation.validationPassword(values.password, values.passwordConfirm);
        const resEmail = validation.validationEmail(values.email);

        if (resLogin !== '') {
            this.eventBus.emit('invalid', {
                login: resLogin,
            })
        } else if (resEmail !== '') {
            this.eventBus.emit('invalid', {
                // Ты же понимаешь, что эти ошибки будут приписаны логину?
                login: resEmail,
            })
        } else if (resPassword !== '') {
            this.eventBus.emit('invalid', {
                // Ты же понимаешь, что эти ошибки будут приписаны логину?
                login: resPassword,
            })
        }

        // Запрос в бд
        // Если что, успешная вылидация -- emit('valid', {});

        this.eventBus.emit('valid', {
            login: 'Все огонь',
        })
    }
}
