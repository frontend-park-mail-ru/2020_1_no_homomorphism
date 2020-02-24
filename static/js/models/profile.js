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

    /*getUserData() {
        ...
        return data;
    }*/
}
