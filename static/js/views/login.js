/**
 *  вью для входа
 */
export class LoginView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
        this.eventBus.on('hide login, show logout', this.hideLoginShowLogout.bind(this));
    }

    /**
    * рендерит страничку входа
    * @param {Object} root
    */
    render(root) {
        this.eventBus.on('cookie fetch response', (loggedIn) => {
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
            // eslint-disable-next-line no-undef
            root.innerHTML = nunjucks.render('../../../views/login.njk');
        });
        this.eventBus.emit('cookie fetch request', {});
        document.addEventListener('click', (event) => {
            if (event.target.getAttribute('id') === 'submit-login') {
                event.preventDefault();
                this.submit();
            }
        });
    }

    /**
     * показывает какие поля неверно заполнены
     * @param {Object} errors
     */
    showErrors(errors) {
        document.getElementsByClassName('login-form')[0].style.borderColor = 'red';
        errors.forEach((key) => {
            if (key === 'global') {
                document.getElementById('global').innerText = errors[key];
                document.getElementById('global').style.height = '20px';
                document.getElementById('global').style.visibility = 'visible';
                document.getElementById('global').style.marginTop = '21px';
            } else {
                const message = document.getElementById(key).nextElementSibling;
                message.previousElementSibling.style.borderColor = 'red';
                message.innerText = errors[key];
                message.style.height = '15px';
                message.style.marginBottom = '10px';
                message.style.visibility = 'visible';
            }
        });
    }

    /**
     * отправляет данные формы
     */
    submit() {
        document.querySelectorAll('.login-form label').forEach((label) => {
            label.children[0].style.borderColor = '#ccc';
            label.children[1].innerText = '';
            label.children[1].style.height = '0';
            label.children[1].style.marginBottom = '0';
            label.children[1].style.visibility = 'hidden';
        });
        document.getElementById('global').style.height = '0';
        document.getElementById('global').style.visibility = 'hidden';
        document.getElementById('global').style.marginTop = '0';
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

    // changeRemember() {
    //    this.eventBus.emit('remember changed', document.getElementById('remember').checked);
    // }
}
