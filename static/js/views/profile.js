export class ProfileView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/profile.njk', data);
        });
        this.eventBus.emit('get user data', {}); // load profile
    }
}
