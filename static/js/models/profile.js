export class ProfileModel {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('get user data', this.getUserData.bind(this));
    }

    getUserData() {
        const data = {
            avatar: 'static/img/new_empire_vol1.jpg',
            login: 'Митрофанов',
            name: 'Дмитрий Алексеевич Левен',
            email: 'leven@dima.go',
            //outer: [],
        };
        this.eventBus.emit('user data', data);
    }
}
