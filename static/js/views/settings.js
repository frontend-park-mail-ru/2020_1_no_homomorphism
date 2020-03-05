/**
 * вью для настроек
 */
export class SettingsView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.eventBus.on('invalid', this.showErrors);
        this.eventBus.on('user data', this.prerender.bind(this));
        this.eventBus.on('cookie fetch response', this.renderWithCookie.bind(this));
        this.eventBus.emit('get user data', {});
    }

    /**
     * слушатель событий для аватарки
     */
    setEventListeners() {
        const button = document.getElementById('submit-changes');
        button.addEventListener('click', (event) => {
            event.preventDefault();
            this.submit();
        });
        const fileAttach = document.getElementById('avatar-upload');
        fileAttach.addEventListener('change', () => {
            console.log('CATCH TOUCH');
            this.eventBus.emit('avatar upload');
        });
    }

    /**
     * рендерит страничку профиля
     * @param root
     */
     render(root) {
         this.eventBus.emit('cookie fetch request', {});
     }
     renderWithCookie(loggedIn) {
         if (loggedIn) {
             document.getElementById('profile-link').style.visibility = 'visible';
             document.getElementById('logout-button').style.visibility = 'visible';
             document.getElementById('signup-link').style.visibility = 'hidden';
             document.getElementById('login-link').style.visibility = 'hidden';
         } else {
             document.getElementById('signup-link').style.visibility = 'visible';
             document.getElementById('login-link').style.visibility = 'visible';
             document.getElementById('profile-link').style.visibility = 'hidden';
         }
         root.innerHTML = this.template;
     }

    prerender(data) {
        this.template = nunjucks.render('../../../views/settings.njk', data);
    }

    /**
     * показывает, какие поля формы заполнены неправильно
     * @param errors
     */
    showErrors(errors) {
        for (let key in errors) {
            const message = document.getElementById(key).nextElementSibling;
            message.previousElementSibling.style.borderColor = (message.getAttribute('class').indexOf('warning') !== -1 ? '#ffae42' : 'red');
            message.innerText = errors[key];
            message.style.height = '15px';
            message.style.marginBottom = '10px';
            message.style.visibility = 'visible';
        }
    }

    /**
     * отправляет данные формы
     */
    submit() {
        console.log('submit-changes clicked');
        document.querySelectorAll('.info input').forEach(input => {
            input.style.borderColor = '#ccc';
            input.nextElementSibling.innerText = '';
            input.nextElementSibling.style.height = '0';
            input.nextElementSibling.style.marginBottom = '0';
            input.nextElementSibling.style.visibility = 'hidden';
        });
        this.eventBus.emit('submit', {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            newPassword: document.getElementById('newPassword').value,
            newPasswordConfirm: document.getElementById('newPasswordConfirm').value,
            password: document.getElementById('password').value,
            //outer              : document.getElementById('outer-url').value,
        });
    }

    //addOuterClick() {
    //    this.eventBus.emit('add outer', document.getElementById('outer-url').value);
    //}
}
