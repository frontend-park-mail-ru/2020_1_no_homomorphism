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

        document.addEventListener('click', (event) => {
            //console.log(event.target);
            if (event.target.getAttribute('id') === 'submit-login') {
                console.log("TOUCHED");
                event.preventDefault();
                //this.submit.bind(this);
                this.submit();
                console.log("TOUCHED2");
            }
            /*if (event. === 'submit-login'){
                console.log("TOUCHED");
                event.preventDefault();
                this.submit.bind(this);
            }*/
        });
        console.log("DIE");
        /*
        document.getElementById('submit').onsubmit = (event) => {
            console.log("TOPKEK");
            this.submit(event);
        };*/
        //document.getElementById('remember').addEventListener('change', this.changeRemember.bind(this));
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

    hideLoginShowLogout() {
        document.getElementById('login-link').style.visibility = 'hidden';
        document.getElementById('signup-link').style.visibility = 'hidden';
        document.getElementById('logout-button').style.visibility = 'visible';
        this.eventBus.emit('redirect to main', 'Успешный вход');
    }

    //changeRemember() {
    //    this.eventBus.emit('remember changed', document.getElementById('remember').checked);
    //}
}
