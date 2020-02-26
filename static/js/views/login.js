export class LoginView {
    constructor(eventBus) {
        this.eventBus = eventBus;



        this.root = document.getElementById('application');
        this.submit = this.submit.bind(this);
        //this.submit.addEventListener('click', this.submit);
        //this.eventBus.on('invalid', this.showErrors);
        this.setEventListeners();
        //console.log("LOL");
        //this.remember.addEventListener('change', this.changeRemember);
    }

    setEventListeners(){
        const button = document.getElementById('submit');
        button.addEventListener('click', this.submit);
    }

    render(root) {
        root.innerHTML = nunjucks.render('../../../views/login.njk');
        document.getElementById('submit').addEventListener('click', this.submit.bind(this));
        document.getElementById('remember').addEventListener('change', this.changeRemember.bind(this));
    }

    showErrors(errors) {
        for (const key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit(event) {
        event.preventDefault();
        this.eventBus.emit('submit', {
            login    : document.getElementById('login').value,
            password : document.getElementById('password').value,
            //remember : document.getElementById('remember').checked,
        });
    }

    //changeRemember() {
    //    this.eventBus.emit('remember changed', document.getElementById('remember').checked);
    //}
}
