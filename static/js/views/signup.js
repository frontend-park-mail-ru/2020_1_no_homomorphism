export class SignupView {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;
        elements.submit.addEventListener('click',
            () => eventBus.emit('submit', {
                name            : elements.name.value,
                login           : elements.login.value,
                sex             : {
                    male   : elements.sex.male.value,
                    female : elements.sex.female.value,
                    other  : elements.sex.other.value,
                },
                email           : elements.email.value,
                password        : elements.password.value,
                passwordConfirm : elements.passwordConfirm.value,
            }));
        eventBus.on('invalid', errors => this.render(errors));
    }

    render(errors) {
        for (key in this.elements) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }
}
