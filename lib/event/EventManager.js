export default class EventManager {
    eventContainer;
    eventHandlers = {};
    bindings = [];
    constructor(eventContainer) {
        this.eventContainer = eventContainer;
    }
    addEvent(eventName, eventHandler) {
        if (!this.eventHandlers[eventName])
            this.eventHandlers[eventName] = [];
        this.eventHandlers[eventName].push(eventHandler);
    }
    removeEvent(eventName, eventHandler) {
        const eventHandlers = this.eventHandlers[eventName];
        if (!eventHandlers)
            return;
        if (!eventHandler)
            delete this.eventHandlers[eventName];
        else {
            const index = eventHandlers.indexOf(eventHandler);
            if (index !== -1)
                eventHandlers.splice(index, 1);
            if (eventHandlers.length === 0)
                delete this.eventHandlers[eventName];
        }
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
        if (!this.eventHandlers) {
            throw new Error("This container is already removed");
        }
        this.emit("remove");
        delete this.eventHandlers;
        for (const binding of this.bindings) {
            binding.target.off("remove", binding.removeHandler);
        }
        delete this.bindings;
    }
}
//# sourceMappingURL=EventManager.js.map