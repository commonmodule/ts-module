export default class EventContainer {
    eventHandlers = {};
    subscriptions = [];
    on(eventName, eventHandler) {
        if (!this.eventHandlers[eventName])
            this.eventHandlers[eventName] = [];
        this.eventHandlers[eventName].push(eventHandler);
        return this;
    }
    off(eventName, eventHandler) {
        const eventHandlers = this.eventHandlers[eventName];
        if (!eventHandlers)
            return this;
        if (!eventHandler)
            delete this.eventHandlers[eventName];
        else {
            const index = eventHandlers.indexOf(eventHandler);
            if (index !== -1)
                eventHandlers.splice(index, 1);
            if (eventHandlers.length === 0)
                delete this.eventHandlers[eventName];
        }
        return this;
    }
    hasEvent(eventName) {
        const events = this.eventHandlers[eventName];
        if (!events)
            return false;
        return events.length > 0;
    }
    async emit(eventName, ...args) {
        const eventHandlers = this.eventHandlers[eventName];
        if (!eventHandlers)
            return [];
        const results = [];
        const promises = [];
        for (const handler of eventHandlers) {
            const result = handler(...args);
            if (result instanceof Promise)
                promises.push(result);
            else
                results.push(result);
        }
        return results.concat(await Promise.all(promises));
    }
    remove() {
        if (!this.eventHandlers) {
            throw new Error("This container is already removed");
        }
        this.emit("remove");
        delete this.eventHandlers;
    }
}
//# sourceMappingURL=EventContainer.js.map