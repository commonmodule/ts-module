export default class EventContainer {
    events = {};
    on(eventName, eventHandler) {
        if (!this.events[eventName])
            this.events[eventName] = [];
        this.events[eventName].push(eventHandler);
    }
    emit(eventName, ...args) {
        if (!this.events[eventName])
            return [];
        return this.events[eventName].map((handler) => handler(...args));
    }
}
//# sourceMappingURL=EventContainer.js.map