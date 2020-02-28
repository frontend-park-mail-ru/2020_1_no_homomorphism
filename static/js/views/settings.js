/**
 * вью для настроек
 */
export class SettingsView {
    /**
     * @param eventBus {EventBus}
     */
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.imageUploaded = false;
        this.eventBus.on('invalid', this.showErrors);
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
            this.imageUploaded = true;
            this.eventBus.emit('avatar upload');
        });
    }

    /**
     * рендерит страничку профиля
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
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/settings.njk', data);
            this.setEventListeners();
        });
        this.eventBus.emit('get user data', {});
    }

    /**
     * показывает, какие поля формы заполнены неправильно
     * @param errors
     */
    showErrors(errors) {
        console.log(errors.key);
    }

    /**
     * отправляет данные формы
     */
    submit() {
        console.log('submit-changes clicked');
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
