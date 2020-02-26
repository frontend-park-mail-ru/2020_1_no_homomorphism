import Api from "../modules/api.js";
import Router from "../modules/router.js";
export class ProfileModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('get user data', this.getUserData.bind(this));
    }

    getUserData() {
        const data = {
            avatar: 'static/img/new_empire_vol1.jpg',
            login: 'Митрофанов',
            name: 'Дмитрий Алексеевич Левен',
            email: 'leven@dima.go',
            //outer: [],
        };
        Api.profileFetch()
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            this.eventBus.emit('user data', data);
                            //this.eventBus.emit('show profile', data);
                        })
                } else {
                    this.eventBus.emit('invalid', 'Ошибка загрузки профиля')
                }
            })

    }

    /*getUserData() {
        ...
        return data;
    }*/
}
