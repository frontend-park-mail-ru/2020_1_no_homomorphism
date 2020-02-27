export class SettingsView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    setEventListeners(){
        const button = document.getElementById('submit');

        const buttonAvatar = document.getElementById('avatar-upload');
        buttonAvatar.addEventListener('change', this.avatarUpload.bind(this));
    }

    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/settings.njk', data);
            this.setEventListeners();
        });
        this.eventBus.emit('get user data', {});
        //document.getElementById('submit').addEventListener('click', this.submit.bind(this));
        //document.getElementById('avatar-upload').addEventListener('change', this.avatarUpload);
        //document.getElementById('add-outer').addEventListener('click', this.addOuterClick);
    }

    showSuccess() {}

    showErrors(errors) {
        for (let key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit(ev) {
        ev.preventDefault();

        this.eventBus.emit('submit', {
            avatar             : document.getElementById('avatar-upload').value,
            name               : document.getElementById('name').value,
            email              : document.getElementById('email').value,
            newPassword        : document.getElementById('newPassword').value,
            newPasswordConfirm : document.getElementById('newPasswordConfirm').value,
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
