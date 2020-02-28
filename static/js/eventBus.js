export class EventBus {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        (this.events[event] || (this.events[event] = [])).push(listener);
        return this;
    }
    emit(event, arg) {
        (this.events[event] || []).slice().forEach(listener => listener(arg));
    }
}
