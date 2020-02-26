export class SettingsView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors.bind(this));
        //this.eventBus.on('valid', this.showSuccess);
    }

    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('settings', data);
        });
        this.eventBus.emit('get user data', {});
        document.getElementById('submit').addEventListener('click', this.submit);
        document.getElementById('avatar-upload').addEventListener('change', this.avatarUpload);
        //document.getElementById('add-outer').addEventListener('click', this.addOuterClick);
    }

    showSuccess() {}

    showErrors(errors) {
        for (let key in errors) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }

    submit() {
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
        this.eventBus.emit('avatar upload', document.getElementById('avatar').value);
    }
    //addOuterClick() {
    //    this.eventBus.emit('add outer', document.getElementById('outer-url').value);
    //}
}
