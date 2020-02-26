export class ProfileView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('profile', data);
        });
        this.eventBus.emit('get user data', {});
    }
}
