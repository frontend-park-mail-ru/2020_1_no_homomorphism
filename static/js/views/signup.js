export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
    }

    render(root) {
        root.innerHTML = nunjucks.render('signup', {kek: 'topkek'});
        document.getElementById('submit').addEventListener('click', this.submit.bind(this));
    }

    showErrors(errors) {
        for (const key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit() {
        this.eventBus.emit('submit', {
            name            : document.getElementById('name').value,
            login           : document.getElementById('login').value,
            email           : document.getElementById('email').value,
            password        : document.getElementById('password').value,
            passwordConfirm : document.getElementById('password-confirm').value,
        });
    }
}
