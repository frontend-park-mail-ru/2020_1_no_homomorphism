export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        //this.submit = this.submit.bind(this);
    }

    render(root) {
        root.innerHTML = nunjucks.render('../../../views/signup.njk', {kek: 'topkek'});
        document.getElementById('submit').addEventListener('click', this.submit.bind(this));
    }

    showErrors(errors) {
        for (const key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit(ev) {
        ev.preventDefault();
        const button = document.getElementById('submit');
        button.addEventListener('click', this.submit);
        console.log("LOL");
        this.eventBus.emit('submit', {
            name            : document.getElementById('name').value,
            login           : document.getElementById('login').value,
            email           : document.getElementById('email').value,
            password        : document.getElementById('password').value,
            passwordConfirm : document.getElementById('password-confirm').value,
        });
    }

    hideLoginShowLogout() {
        document.getElementById('login-link').style.visibility = 'hidden';
        document.getElementById('signup-link').style.visibility = 'hidden';
        document.getElementById('logout-button').style.visibility = 'visible';
        this.eventBus.emit('redirect to main', 'Успешная регистрация')
    }
}
