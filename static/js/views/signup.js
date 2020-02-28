export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.submit.bind(this);
        this.eventBus.on('hide login, show logout', this.hideLoginShowLogout);
        this.eventBus.on('invalid', this.showErrors);
    }

    render(root, loggedIn) {
        if (loggedIn) {
            document.getElementById('profile-link').style.visibility = 'visible';
            document.getElementById('logout-button').style.visibility = 'visible';
            document.getElementById('signup-link').style.visibility = 'hidden';
            document.getElementById('login-link').style.visibility = 'hidden';
        } else {
            document.getElementById('signup-link').style.visibility = 'visible';
            document.getElementById('login-link').style.visibility = 'visible';
            document.getElementById('profile-link').style.visibility = 'hidden';
            document.getElementById('logout-button').style.visibility = 'hidden';
        }
        root.innerHTML = nunjucks.render('../../../views/signup.njk');

        document.addEventListener('click', (event) => {
            console.log(event.target.getAttribute('id'));
            if (event.target.getAttribute('id') === 'submit') {
                event.preventDefault();
                this.submit();
            }
        })
    }

    showErrors(error) {
        console.log('INPUT ERROR ');
    }

    submit() {
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
