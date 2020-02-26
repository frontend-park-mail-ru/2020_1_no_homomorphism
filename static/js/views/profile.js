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
        document.getElementById('avatar').src = data.avatar;
        document.getElementById('login').value = data.login;
        document.getElementById('name').value = data.name;
        document.getElementById('email').value = data.email;
        /*for (let key in data) {
            if (data.hasOwnProperty(key)) {
                document.getElementById(`${key}`).value = data.key;
            }
        }*/
    }

    render() {
        // Отрисовочка страницы - Никита
        this.eventBus.emit('load profile', '');
    }
}
