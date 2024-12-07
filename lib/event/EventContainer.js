export default class EventContainer {
    events = {};
    on(eventName, eventHandler) {
        if (!this.events[eventName])
            this.events[eventName] = [];
        this.events[eventName].push(eventHandler);
        return this;
    }
    off(eventName, eventHandler) {
        const events = this.events[eventName];
        if (!events)
            return this;
        if (!eventHandler) {
            delete this.events[eventName];
        }
        else {
            const index = events.indexOf(eventHandler);
            if (index !== -1)
                events.splice(index, 1);
            if (events.length === 0)
                delete this.events[eventName];
        }
        return this;
    }
    hasEvent(eventName) {
        const events = this.events[eventName];
        if (!events)
            return false;
        return events.length > 0;
    }
    emit(eventName, ...args) {
        const events = this.events[eventName];
        if (!events)
            return [];
        return events.map((handler) => handler(...args));
    }
}
//# sourceMappingURL=EventContainer.js.map