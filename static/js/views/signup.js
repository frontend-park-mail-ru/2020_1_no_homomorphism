export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.elements = {
            name            : document.getElementById('name'),
            login           : document.getElementById('login'),
            email           : document.getElementById('email'),
            password        : document.getElementById('password'),
            passwordConfirm : document.getElementById('password-confirm'),
            submit          : document.getElementById('submit'),
        };
        this.elements.submit.addEventListener('click', this.submit);
        this.eventBus.on('invalid', this.render);
    }

    render(errors) {
        for (key in this.elements) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }

    submit() {
        this.eventBus.emit('submit', {
            name            : this.elements.name.value,
            login           : this.elements.login.value,
            email           : this.elements.email.value,
            password        : this.elements.password.value,
            passwordConfirm : this.elements.passwordConfirm.value,
        });
    }
}
