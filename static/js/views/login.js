export class LoginView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
        this.eventBus.on('hide login, show logout', this.hideLoginShowLogout.bind(this));
    }

    /**
    * рендерит страничку входа
    * @param root
    */
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
        root.innerHTML = nunjucks.render('../../../views/login.njk');
        document.addEventListener('click', (event) => {
            if (event.target.getAttribute('id') === 'submit-login') {
                event.preventDefault();
                this.submit();
            }
        });
    }

    /**
     * показывает какие поля неверно заполнены
     * @param errors
     */
    showErrors(errors) {
        document.getElementsByClassName('login-form')[0].style.borderColor = 'red';
        document.getElementsByClassName('error-message')[0].style.height = '20px';
        document.getElementsByClassName('error-message')[0].style.visibility = 'visible';
        document.getElementsByClassName('error-message')[0].style.marginTop = '21px';
        console.log('LOGIN ERROR');
    }

    /**
     * отправляет данные формы
     */
    submit() {
        this.eventBus.emit('submit', {
            login: document.getElementById('login').value,
            password: document.getElementById('password').value,
        });
    }

    /**
     * прячет кнопку логина и регистрации и показывает кнопку логаута
     */
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
