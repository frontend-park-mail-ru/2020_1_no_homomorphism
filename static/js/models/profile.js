import {Api} from "../modules/api.js";
import {Router} from "../modules/router.js";
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
            console.log("API");
            if (res === undefined){
                //return
                console.log('EMPTY');
                this.eventBus.emit('redirect to main', 'Ошибка загрузки профиля');
                return
            }
            if (res.ok) {
                res.text()
                .then(data => {
                    this.eventBus.emit('user data', JSON.parse(data));
                    //this.eventBus.emit('show profile', data);
                })
            } else {
                //console.log("API");
                this.eventBus.emit('no answer', 'Ошибка загрузки профиля')
            }
        })

    }

    /*getUserData() {
        ...
        return data;
    }*/
}
