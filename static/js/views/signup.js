export class SignupView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.submit.bind(this);
    }

    render(root) {
        root.innerHTML = nunjucks.render('../../../views/signup.njk', {kek: 'topkek'});

        console.log('RENDER');
        document.addEventListener('click', (event) => {
            //console.log(event.target);
            console.log('COME CLICK');
            console.log(event.target.getAttribute('id'));
            if (event.target.getAttribute('id') === 'submit') {
                console.log('WORK WITH CLICK');
                event.preventDefault();
                this.submit();
            }
        })
    }

    showErrors(error) {
        console.log('INPUT ERROR ');
    }

    submit() {
        console.log("LOL");
        this.eventBus.emit('submit', {
            name: document.getElementById('name').value,
            login: document.getElementById('login').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            passwordConfirm: document.getElementById('password-confirm').value,
        });
    }
}
