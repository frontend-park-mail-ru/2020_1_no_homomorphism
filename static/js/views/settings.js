export class SettingsView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.imageUploaded = false;
    }

    setEventListeners() {
        const button = document.getElementById('submit');
        button.addEventListener('click', (event) => {
            console.log("TOUCHED");
            event.preventDefault();
            this.submit.bind(this);

        });
        const fileAttach = document.getElementById('avatar-upload');
        fileAttach.addEventListener('change', () => {
            this.eventBus.emit('avatar upload');
        });
    }


    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/settings.njk', data);
            this.setEventListeners();
        });
        this.eventBus.emit('get user data', {});
    }

    showErrors(errors) {
        for (let key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit() {
        let avatar = null;
        if (this.imageUploaded) {
            const fileAttach = document.getElementById('avatar-upload');
            avatar = fileAttach.files[0]
        }
        this.eventBus.emit('submit', {
            avatar: avatar,
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
