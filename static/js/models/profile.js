import Api from "../modules/api.js";
import Router from "../modules/router.js";
export class ProfileModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    loadProfile() {
        console.log('PROFILE');
        Api.profileFetch()
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then(data => {
                            this.eventBus.emit('show profile', data);
                        })
                } else {
                    this.eventBus.emit('invalid', 'Ошибка загрузки профиля')
                }
            })
    }
}
