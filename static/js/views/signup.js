/**
 * Вью для страницы регистрации
 */
export class SignupView {
    /**
     * @param {EventBus} eventBus
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.submit.bind(this);
        this.eventBus.on('hide login, show logout', this.hideLoginShowLogout);
        this.eventBus.on('invalid', this.showErrors);
    }

    /**
     * рендерит страничку регистрации
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
            root.innerHTML = nunjucks.render('../../../views/signup.njk');
        });
        this.eventBus.emit('cookie fetch request', {});
        document.addEventListener('click', (event) => {
            console.log(event.target.getAttribute('id'));
            if (event.target.getAttribute('id') === 'submit') {
                event.preventDefault();
                this.submit();
            }
        });
    }

    /**
     * показывает, что поля были заполнены неправильно
     * @param {Object} errors
     */
    showErrors(errors) {
        document.getElementsByClassName('sign-up-form')[0].style.borderColor = 'red';
        for (const key in errors) {
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
        }
    }

    /**
     * отправляет данные формы
     */
    submit() {
        document.querySelectorAll('.sign-up-form label').forEach((label) => {
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
            name: document.getElementById('name').value,
            login: document.getElementById('login').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            passwordConfirm: document.getElementById('password-confirm').value,
        });
    }

    /**
    /* Смена кнопочек в профиле при регистрации
     */
    hideLoginShowLogout() {
        document.getElementById('login-link').style.visibility = 'hidden';
        document.getElementById('signup-link').style.visibility = 'hidden';
        document.getElementById('logout-button').style.visibility = 'visible';
    }
}
