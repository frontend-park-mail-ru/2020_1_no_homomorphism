import {Api} from "../modules/api.js";
import {Router} from "../modules/router.js";
export class ProfileModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('get user data', this.getUserData.bind(this));
    }

    getUserData() {
        Api.profileFetch()
        .then((res) => {
            if (res === undefined){
                console.log('NO ANSWER FROM BACKEND');
                this.eventBus.emit('redirect to main', 'Ошибка загрузки профиля');
                return
            }
            if (res.ok) {
                res.text()
                .then((data) => {
                    this.eventBus.emit('user data', JSON.parse(data));
                })
            } else {
                this.eventBus.emit('no answer', 'Ошибка загрузки профиля')
            }
        })

    }
}
