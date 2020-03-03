import {Api} from '../modules/api.js'

/**
 * Модель для навбара
 */
export class NavbarModel {
    constructor(eventBus, globalEventBus) {
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;
    }

    logout() {
        Api.logoutFetch();
    }

    getUserData() {
        Api.profileFetch()
        .then((res) => {
            if (res === undefined){
                console.log('NO ANSWER FROM BACKEND');
                this.eventBus.emit('redirect to main', 'Ошибка загрузки профиля');
                return;
            }
            if (res.ok) {
                res.text()
                .then((data) => {
                    this.eventBus.emit('user data', JSON.parse(data));
                });
            } else {
                this.eventBus.emit('no answer', 'Ошибка загрузки профиля');
            }
        });
    }
}
