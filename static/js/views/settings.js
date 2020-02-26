export class SettingsView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.submit = this.submit().bind(this);
        this.setEventListeners();
    }

    setEventListeners(){
        const button = document.getElementById('submit');
        button.addEventListener('click', this.submit);

        const buttonAvatar = document.getElementById('avatar-upload');
        buttonAvatar.addEventListener('avatar upload', this.avatarUpload);
    }

    showProfile(data) {
        document.getElementById('avatar').src = data.avatar;
        document.getElementById('name').value = data.name;
        document.getElementById('email').value = data.email;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                document.getElementById(`${key}`).value = data.key;
            }
        }
    }

    render() {
        this.eventBus.emit('load profile settings', '');
    }

    showSuccess() {}

    showErrors(errors) {
        for (let key in errors) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }

    submit(ev) {
        ev.preventDefault();
        this.eventBus.emit('submit', {
            avatar          : document.getElementById('avatar').value,
            avatarUpload    : document.getElementById('avatar-upload').value,
            name            : document.getElementById('name').value,
            email           : document.getElementById('email').value,
            password        : document.getElementById('password').value,
            passwordConfirm : document.getElementById('password-confirm').value,
        });
    }

    avatarUpload() {
        this.eventBus.emit('avatar upload', document.getElementById('avatar-upload'));
    }
    addOuterClick() {
        this.eventBus.emit('add outer', this.elements.outerUrl.value);
    }
}
