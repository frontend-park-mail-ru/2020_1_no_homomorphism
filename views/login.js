export class LoginView {
    constructor(eventBus, elements) {
        this.eventBus = eventBus;
        this.elements = elements;
        elements.submit.addEventListener('click',
            () => eventBus.emit('submit', {
                'login'    : elements.login.value,
                'password' : elements.password.value,
                'remember' : elements.remember.checked,
            }));
        elements.remember.addEventListener('change',
            () => eventBus.emit('remember changed', elements.remember.checked));
        eventBus.on('invalid', errors => this.render(errors));
    }

    render(errors) {
        this.elements.login.setCustomValidity(errors.login);
        this.elements.password.setCustomValidity(errors.login);
    }
}
