/**
 * EventBus
 */
export default class EventBus {
    /**
     * Конструктор
     */
    constructor() {
        this.events = {};
    }

    /**
     * @param {string} event
     * @param {function} listener
     * @return {EventBus}
     */
    on(event, listener) {
        (this.events[event] || (this.events[event] = [])).push(listener);
        return this;
    }

    /**
     *
     * @param {string} event
     * @param {Object} arg
     */
    emit(event, ...arg) {
        (this.events[event] || []).slice().forEach((listener) => listener(...arg));
    }
}
