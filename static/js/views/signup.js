export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        //this.submit = this.submit.bind(this);

    }

    render(root) {
        root.innerHTML = nunjucks.render('../../../views/signup.njk', {kek: 'topkek'});
        document.getElementById('submit').addEventListener('click', this.submit.bind(this));



        document.addEventListener('click', (event) => {
            //console.log(event.target);
            if (event.target.getAttribute('id') === 'submit') {
                event.preventDefault();
                this.submit.bind(this);
                this.submit();
            }
        })
    }

    showErrors(errors) {
        for (const key in errors) {
            document.getElementById(key).setCustomValidity(errors.key);
        }
    }

    submit(ev) {
        console.log("LOL");
        this.eventBus.emit('submit', {
            name            : document.getElementById('name').value,
            login           : document.getElementById('login').value,
            email           : document.getElementById('email').value,
            password        : document.getElementById('password').value,
            passwordConfirm : document.getElementById('password-confirm').value,
        });
    }
}
