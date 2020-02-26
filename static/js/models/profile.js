import Api from "../modules/api";
import Router from "../modules/router";
export class ProfileModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            // Брать из БД при создании класса или при загрузке страницы?
            avatar   : {},
            login    : '',
            name     : '',
            email    : '',
            outer    : [],
        };
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
