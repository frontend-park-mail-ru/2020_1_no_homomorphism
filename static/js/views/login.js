export class LoginView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
    }

    render(root) {
        root.innerHTML = nunjucks.render('login');
        document.getElementById('submit').addEventListener('click', this.submit.bind(this));
        document.getElementById('remember').addEventListener('change', this.changeRemember.bind(this));
    }

    showErrors(errors) {
        for (const key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit() {
        this.eventBus.emit('submit', {
            login    : document.getElementById('login').value,
            password : document.getElementById('password').value,
            remember : document.getElementById('remember').checked,
        });
    }

    changeRemember() {
        this.eventBus.emit('remember changed', this.elements.remember.checked);
    }
}
