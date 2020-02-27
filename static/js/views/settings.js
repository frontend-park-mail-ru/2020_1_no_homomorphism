export class SettingsView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    setEventListeners(){
        const button = document.getElementById('submit');
        button.addEventListener('click', this.submit);

        const buttonAvatar = document.getElementById('avatar-upload');
        buttonAvatar.addEventListener('change', this.avatarUpload);
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
    render(root) {

        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/settings.njk', data);
        });
        this.setEventListeners();
        this.eventBus.emit('get user data', {});
        document.getElementById('submit').addEventListener('click', this.submit);
        document.getElementById('avatar-upload').addEventListener('change', this.avatarUpload);
        //document.getElementById('add-outer').addEventListener('click', this.addOuterClick);
    }

    showSuccess() {}

    showErrors(errors) {
        for (const key in errors) {
            //this.elements.key.setCustomValidity(errors.key);
        }
    }

    submit(ev) {
        ev.preventDefault();

        this.eventBus.emit('submit', {
            avatar             : document.getElementById('avatar-upload').value,
            name               : document.getElementById('name').value,
            email              : document.getElementById('email').value,
            newPassword        : document.getElementById('new-password').value,
            newPasswordConfirm : document.getElementById('new-password-confirm').value,
            password           : document.getElementById('password').value,
            //outer              : document.getElementById('outer-url').value,
        });
    }

    avatarUpload() {
        this.eventBus.emit('avatar upload', document.getElementById('avatar-upload').value);
    }
    //addOuterClick() {
    //    this.eventBus.emit('add outer', document.getElementById('outer-url').value);
    //}
}
