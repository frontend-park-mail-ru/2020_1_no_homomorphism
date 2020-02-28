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
    }

    /**
     * слушатель событий для аватарки
     */
    setEventListeners() {
        const button = document.getElementById('avatar-settings');
        button.addEventListener('click', (event) => {
            console.log("TOUCHED");
            event.preventDefault();
            this.submit.bind(this);

        });
        const fileAttach = document.getElementById('avatar-upload');
        fileAttach.addEventListener('change', () => {
            console.log('CATCH TOUCH');
            this.eventBus.emit('avatar upload', {});
        });
    }

    /**
     * рендерит страничку профиля
     * @param root
     */
    render(root) {
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
        for (let key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    /**
     * отправляет данные формы
     */
    submit() {
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
