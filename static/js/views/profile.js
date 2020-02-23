export class ProfileView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.elements = {
            avatar   : document.getElementById('avatar'),
            login    : document.getElementById('login'),
            name     : document.getElementById('name'),
            email    : document.getElementById('email'),
            outer    : document.getElementsByClassName('outer'),
        };
    }
}
