export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.submit.bind(this);
        this.eventBus.on('hide login, show logout', this.hideLoginShowLogout);
        this.eventBus.on('invalid', this.showErrors);
    }

    render(root) {
        root.innerHTML = nunjucks.render('../../../views/signup.njk');

        console.log('RENDER');
        document.addEventListener('click', (event) => {
            console.log(event.target.getAttribute('id'));
            if (event.target.getAttribute('id') === 'submit') {
                console.log('COME');
                event.preventDefault();
                this.submit();
            }
        })
    }

    showErrors(error) {
        console.log('INPUT ERROR ');
    }

    submit() {
        console.log('SUBMIT');
        this.eventBus.emit('submit', {
            name: document.getElementById('name').value,
            login: document.getElementById('login').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            passwordConfirm: document.getElementById('password-confirm').value,
        });
    }

    hideLoginShowLogout() {
        document.getElementById('login-link').style.visibility = 'hidden';
        document.getElementById('signup-link').style.visibility = 'hidden';
        document.getElementById('logout-button').style.visibility = 'visible';
    }
}
