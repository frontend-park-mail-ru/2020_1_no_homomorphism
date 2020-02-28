export class LoginView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
        this.eventBus.on('hide login, show logout', this.hideLoginShowLogout.bind(this));
    }

    render(root) {
        console.log("MDA");
        root.innerHTML = nunjucks.render('../../../views/login.njk');

        document.addEventListener('click', (event) => {
            if (event.target.getAttribute('id') === 'submit-login') {
                event.preventDefault();
                this.submit();
            }
        });
    }

    showErrors(errors) {
        console.log('LOGIN ERROR');
    }

    submit() {
        console.log("SUBMIT");
        //event.preventDefault();
        this.eventBus.emit('submit', {
            login: document.getElementById('login').value,
            password: document.getElementById('password').value,
        });
    }

    hideLoginShowLogout() {
        document.getElementById('login-link').style.visibility = 'hidden';
        document.getElementById('signup-link').style.visibility = 'hidden';
        document.getElementById('logout-button').style.visibility = 'visible';
        this.eventBus.emit('redirect to main', 'Успешный вход');
    }

    //changeRemember() {
    //    this.eventBus.emit('remember changed', document.getElementById('remember').checked);
    //}
}
