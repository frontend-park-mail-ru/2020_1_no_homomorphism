export class SignupView {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;
        elements.submit.addEventListener('click',
            () => eventBus.emit('submit', {
                avatar          : elements.avatarUpload.value,
                birthday        : elements.birthday.value,
                name            : elements.name.value,
                email           : elements.email.value,
                password        : elements.password.value,
                passwordConfirm : elements.passwordConfirm.value,
                outer           : elements.outerUrl,
            }));
        elements.avatarUpload.addEventListener('change', () => eventBus.emit('avatar upload', elements.avatar.value));
        elements.addOuter.addEventListener('click', () => eventBus.emit('add outer', elements.outerUrl.value));
        eventBus.on('invalid', errors => this.render(errors));
    }

    render(errors) {
        for (key in this.elements) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }
}
