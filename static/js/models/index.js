import {Api} from "../modules/api.js";

export class IndexModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    logout() {
        Api.logoutFetch();
    }
}
