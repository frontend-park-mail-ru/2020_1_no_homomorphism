export class EventBus {
    constructor() {
        this.events = {};
    }
    on(evt, listener) {
        console.log('subscribed at ' + evt);
        (this.events[evt] || (this.events[evt] = [])).push(listener);
        return this;
    }
    emit(evt, arg) {
        console.log('got new ' + evt);
        (this.events[evt] || []).slice().forEach(lsn => lsn(arg));
    }
};
