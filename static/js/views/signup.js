/**
 * Вью для страницы регистрации
 */
export class SignupView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.submit.bind(this);
    }

    /**
     * рендерит страничку регистрации
     * @param root
     */
    render(root) {
        root.innerHTML = nunjucks.render('../../../views/signup.njk');

        console.log('RENDER');
        document.addEventListener('click', (event) => {
            console.log('COME CLICK');
            console.log(event.target.getAttribute('id'));
            if (event.target.getAttribute('id') === 'submit') {
                console.log('WORK WITH CLICK');
                event.preventDefault();
                this.submit();
            }
        })
    }

    /**
     * показывает, что поля были заполнены неправильно
     * @param error
     */
    showErrors(error) {
        console.log('INPUT ERROR ');
    }

    /**
     * отправляет данные формы
     */
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
        this.eventBus.emit('redirect to main', 'Успешная регистрация')
    }
}
