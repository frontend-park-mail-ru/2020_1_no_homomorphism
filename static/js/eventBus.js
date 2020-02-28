export class EventBus {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        console.log('subscribed at ' + event);
        (this.events[event] || (this.events[event] = [])).push(listener);
        return this;
    }
    emit(event, arg) {
        console.log('got new ' + event);
        (this.events[event] || []).slice().forEach(listener => listener(arg));
    }
};
