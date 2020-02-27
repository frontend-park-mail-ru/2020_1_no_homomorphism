export class LoginView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    render(root) {
        console.log("MDA");
        root.innerHTML = nunjucks.render('../../../views/login.njk');

        document.addEventListener('click', (event) => {
            if (event.target.getAttribute('id') === 'submit-login') {
                console.log("TOUCHED");
                event.preventDefault();
                //this.submit.bind(this);
                this.submit();
                console.log("TOUCHED2");
            }
        });
        console.log("DIE");
    }

    showErrors(errors) {
        for (const key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit() {
        console.log("SUBMIT");
        //event.preventDefault();
        this.eventBus.emit('submit', {
            login: document.getElementById('login').value,
            password: document.getElementById('password').value,
            //remember : document.getElementById('remember').checked,
        });
    }

    //changeRemember() {
    //    this.eventBus.emit('remember changed', document.getElementById('remember').checked);
    //}
}
