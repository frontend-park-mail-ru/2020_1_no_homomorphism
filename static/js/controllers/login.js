export class LoginController {
    constructor(view, model, eventBus, globalEventBus) {
        this.view = view;
        this.model = model;
        this.eventBus = eventBus;
        this.globalEventBus = globalEventBus;

        eventBus.on('valid', to => this.redirect(to));
    }

    redirect(to) {}
};
