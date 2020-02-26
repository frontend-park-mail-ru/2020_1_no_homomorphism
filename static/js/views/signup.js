export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.submit = this.submit.bind(this);
        const button = document.getElementById('submit');
        button.addEventListener('click', this.submit);
    }

    render() {
        // Отрисовка он Никитки
    }

    showErrors(errors) {
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                document.getElementById(`${key}`).setCustomValidity(errors.key);
            }
        }
    }

    submit(ev) {
        ev.preventDefault();
        console.log("LOL");
        this.eventBus.emit('submit', {
            name            : document.getElementById('name').value,
            login            : document.getElementById('login').value,
            email           : document.getElementById('email').value,
            password        : document.getElementById('password').value,
            passwordConfirm : document.getElementById('password-confirm').value,
        });
    }
}
