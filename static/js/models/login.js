import {Api} from "../modules/api.js";
export class LoginModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('submit', this.submit.bind(this));

        //this.eventBus.on('remember changed', this.changeRemember);
        //this.eventBus.on('submit', this.submit);
        //this.eventBus.on('remember changed', this.changeRemember);
    }

    submit(values) {
        if (values.login.empty) {
            this.eventBus.emit('invalid', 'Введите логин/email!')
        } else if (values.password.empty) {
            this.eventBus.emit('invalid', 'Введите пароль!')
        } else {
            Api.loginFetch(values.login, values.password)
                .then((res)=> {
                    if (res === undefined){
                        console.log('-----Server error');
                        this.eventBus.emit('redirect to main', 'Ошибка загрузки логина');
                        return
                    }
                    if (res.ok) {
                        console.log('SUCCESS');
                        this.eventBus.emit('hide login, show logout', {});
                    } else {
                        console.log('ENTRY ERROR');
                        this.eventBus.emit('invalid', 'Ошибка входа!')
                    }
                })
        }

    }

    /*changeRemember(state) {
        this.data.remember = state;
    }*/
}
