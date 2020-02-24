export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.elements = {
            name            : document.getElementById('name'),
            login           : document.getElementById('login'),
            email           : document.getElementById('email'),
            password        : document.getElementById('password'),
            passwordConfirm : document.getElementById('password-confirm'),
            submit          : document.getElementById('submit'),
            but_lol          : document.getElementById('but_lol'),
        };
        this.elements.but_lol.addEventListener('click', this.myFunction);
        this.elements.submit.addEventListener('click', this.submit);
        console.error("myyyy");
        this.eventBus.on('invalid', this.showErrors);
    }

    myFunction() {
        // Get the snackbar DIV
        const x = document.getElementById("snackbar");

        // Add the "show" class to DIV
        x.className = "show";

        console.error("mda");

        // After 3 seconds, remove the show class from DIV
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }

    render() {}

    showErrors(errors) {
        for (let key in errors) {
            this.elements.key.setCustomValidity(errors.key);
        }
    }

    submit() {
        console.log("LOL");
        this.eventBus.emit('submit', {
            name            : this.elements.name.value,
            login           : this.elements.login.value,
            email           : this.elements.email.value,
            password        : this.elements.password.value,
            passwordConfirm : this.elements.passwordConfirm.value,
        });
    }
}
