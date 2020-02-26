export class LoginView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    render(root) {
        console.log("MDA");
        root.innerHTML = nunjucks.render('../../../views/login.njk');

        const form = document.getElementById('submit-login');
        console.log(form.id);
        console.log(form.nodeType);
        console.log(form.on);

        form.addEventListener('click', () => {
            console.log("EVENT LISTENER");
            //event.preventDefault();
            this.submit.bind(this);
        }, false);

        form.addEventListener('submit', (event) => {
            console.log("EVENT LISTENER");
            event.preventDefault();
            this.submit.bind(this);
        }, false);
        console.log("DIE");
        /*
        document.getElementById('submit').onsubmit = (event) => {
            console.log("TOPKEK");
            this.submit(event);
        };*/
        //document.getElementById('remember').addEventListener('change', this.changeRemember.bind(this));
    }

    showErrors(errors) {
        console.log("ORU");
        /*for (const key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }*/
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
