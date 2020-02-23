export class LoginView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.elements = {
            login    : document.getElementById('login'),
            password : document.getElementById('password'),
            remember : document.getElementById('remember'),
            submit   : document.getElementById('submit'),
        };
        this.elements.submit.addEventListener('click', this.submit);
        this.elements.remember.addEventListener('change', this.changeRemember);
        this.eventBus.on('invalid', this.render);
    }

    render(errors) {
        for (key in this.elements) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }

    submit() {
        this.eventBus.emit('submit', {
            login    : this.elements.login.value,
            password : this.elements.password.value,
            remember : this.elements.remember.checked,
        });
    }

    changeRemember() {
        this.eventBus.emit('remember changed', this.elements.remember.checked);
    }
}
