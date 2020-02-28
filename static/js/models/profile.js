import {Api} from "../modules/api.js";
import {Router} from "../modules/router.js";

/**
 * Модель Профиля
 */
export class ProfileModel {
    /**
     * конструктор
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('get user data', this.getUserData.bind(this));
    }

    /**
     * получает профиль юзера
     */
    getUserData() {
        Api.profileFetch()
        .then((res) => {
            if (res === undefined){
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
