import Api from "../modules/api";
import Router from "../modules/router";
export class ProfileModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    loadProfile() {
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
