export class ProfileView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    showErrors(errors) {
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                document.getElementById(`${key}`).setCustomValidity(errors.key);
            }
            //this.elements.key.setCustomValidity(errors.key);
        }
    }

    showProfile(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                document.getElementById(`${key}`).value = data.key;
            }
        }
    }

    render() {
        this.eventBus.emit('load profile', '');
    }
}
