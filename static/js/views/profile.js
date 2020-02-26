export class ProfileView {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }

    /*showErrors(errors) {
        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {
                document.getElementById(`${key}`).setCustomValidity(errors.key);
            }
            //this.elements.key.setCustomValidity(errors.key);
        }
    }*/

    render(root) {
        this.eventBus.on('user data', (data) => {
            root.innerHTML = nunjucks.render('../../../views/profile.njk', data);
        });
        this.eventBus.emit('get user data', {}); // load profile
    /*showProfile(data) {
        document.getElementById('avatar').src = data.avatar;
        document.getElementById('login').value = data.login;
        document.getElementById('name').value = data.name;
        document.getElementById('email').value = data.email;
    }*/
}
