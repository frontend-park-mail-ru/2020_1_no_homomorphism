export class SettingsView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.elements = {
            avatar          : document.getElementById('avatar'),
            avatarUpload    : document.getElementById('avatar-upload'),
            name            : document.getElementById('name'),
            email           : document.getElementById('email'),
            password        : document.getElementById('password'),
            passwordConfirm : document.getElementById('password-confirm'),
            outer           : document.getElementsByClassName('accounts-edit')[0].children,
            outerUrl        : document.getElementById('outer-url'),
            addOuter        : document.getElementById('add-outer'),
            submit          : document.getElementById('submit'),
        };
        this.elements.submit.addEventListener('click', this.submit);
        this.elements.avatarUpload.addEventListener('change', this.avatarUpload);
        this.elements.addOuter.addEventListener('click', this.addOuterClick);
        this.eventBus.on('invalid', this.showErrors);
        this.eventBus.on('valid', this.showSuccess);
    }

    render(data) {
        for (let key in data) {
            this.elements.key.value = data.key;
        }
    }

    showSuccess() {}

    showErrors(errors) {
        for (let key in errors) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }

    submit() {
        this.eventBus.emit('submit', {
            avatar          : this.elements.avatarUpload.value,
            name            : this.elements.name.value,
            email           : this.elements.email.value,
            password        : this.elements.password.value,
            passwordConfirm : this.elements.passwordConfirm.value,
            outer           : this.elements.outerUrl,
        });
    }

    avatarUpload() {
        this.eventBus.emit('avatar upload', this.elements.avatar.value);
    }
    addOuterClick() {
        this.eventBus.emit('add outer', this.elements.outerUrl.value);
    }
}
