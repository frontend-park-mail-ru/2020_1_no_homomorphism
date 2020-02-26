import Validation from '../modules/validation.js';
import Api from "../modules/api.js";

export class SettingsModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('avatar upload', this.resetAvatar.bind(this));
        //this.eventBus.on('add outer', this.addOuter.bind(this));
        this.eventBus.on('submit', this.submit.bind(this));
        this.eventBus.on('get user data', this.getUserData.bind(this));
    }

    loadProfile() {
        Api.profileFetch()
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            this.eventBus.emit('show profile settings', data);
                        })
                } else {
                    this.eventBus.emit('invalid', 'Ошибка загрузки профиля')
                }
            })
    }


    getUserData() {
        const data = {
            avatar: 'static/img/new_empire_vol1.jpg',
            login: 'Митрофанов',
            name: 'Дмитрий Алексеевич Левен',
            email: 'leven@dima.go',
            //outer: [],
        };
        this.eventBus.emit('user data', data);
    }

    resetAvatar(avatar) {
        //...

        const formData = new FormData();
        formData.append('file', image[0]);

        Api.profilePhotoFetch()
        this.eventBus.emit('new avatar', avatar);
    }

    //addOuter(url) {
        //...
    //    this.eventBus.emit('new outer', outer);
    //}

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
