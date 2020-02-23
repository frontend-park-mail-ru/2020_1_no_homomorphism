export class ProfileModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = {
            avatar   : {},
            login    : '',
            name     : '',
            email    : '',
            outer    : [],
        };
    }
}
