export class ProfileView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        document.getElementById('logout-button').addEventListner('click', this.eventBus.emit('logout', {}));
    }

    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/error.njk', data);
        });
        this.eventBus.emit('get user data', {}); // load profile
    }
}
