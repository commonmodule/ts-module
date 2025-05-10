export default class EventManager {
    eventContainer;
    events = {};
    bindings = [];
    constructor(eventContainer) {
        this.eventContainer = eventContainer;
    }
    addEvent(eventName, eventHandler) {
        if (!this.events[eventName])
            this.events[eventName] = [];
        this.events[eventName].push({ eventHandler });
    }
    addOnceEvent(eventName, eventHandler) {
        if (!this.events[eventName])
            this.events[eventName] = [];
        this.events[eventName].push({ eventHandler, once: true });
    }
    removeEvent(eventName, eventHandler) {
        const events = this.events[eventName];
        if (!events)
            return;
        if (!eventHandler)
            delete this.events[eventName];
        else {
            const index = events.findIndex((h) => h.eventHandler === eventHandler);
            if (index !== -1)
                events.splice(index, 1);
            if (events.length === 0)
                delete this.events[eventName];
        }
    }
    async emit(eventName, ...args) {
        const events = this.events[eventName];
        if (!events)
            return [];
        const results = [];
        const promises = [];
        for (const event of events) {
            const result = event.eventHandler(...args);
            if (event.once)
                this.removeEvent(eventName, event.eventHandler);
            if (result instanceof Promise)
                promises.push(result);
            else
                results.push(result);
        }
        return results.concat(await Promise.all(promises));
    }
    bind(target, eventName, eventHandler) {
        this.eventContainer.on(eventName, eventHandler);
        const removeHandler = () => {
            this.eventContainer.off(eventName, eventHandler);
            const findIndex = this.bindings.findIndex((b) => b.target === target && b.eventName === eventName &&
                b.eventHandler === eventHandler);
            if (findIndex !== -1)
                this.bindings.splice(findIndex, 1);
        };
        target.on("remove", removeHandler);
        this.bindings.push({
            eventName: eventName,
            target,
            eventHandler,
            removeHandler,
        });
    }
    remove() {
        if (!this.events)
            throw new Error("This manager is already removed");
        this.emit("remove");
        delete this.events;
        for (const binding of this.bindings) {
            binding.target.off("remove", binding.removeHandler);
        }
        delete this.bindings;
    }
}
//# sourceMappingURL=EventManager.js.map