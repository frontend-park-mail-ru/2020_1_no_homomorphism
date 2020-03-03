import {Api} from '../modules/api.js'

/**
 * Модель для навбара
 */
export class NavbarModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    logout() {
        Api.logoutFetch();
    }
}
