
export class LoginView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.root = document.getElementById('application');
        this.submit = this.submit().bind(this);
        //this.submit.addEventListener('click', this.submit);

        const button = document.getElementById('submit');
        button.addEventListener('click', this.submit);
        //console.log("LOL");
        //this.remember.addEventListener('change', this.changeRemember);
    }

    render() {
        // отрисовочка - делает Никита
    }

    showErrors(errors) {
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                document.getElementById(`${key}`).setCustomValidity(errors.key);
            }
        }
    }

    submit(event) {
        event.preventDefault();
        this.eventBus.emit('submit', {
            login: document.getElementById('login'),
            password: document.getElementById('password'),
        });
    }

    changeRemember() {
        this.eventBus.emit('remember changed', document.getElementById('remember').checked);
    }
}
