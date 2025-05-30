import EventManager from "./EventManager.js";
export default class EventContainer {
    eventManager = new EventManager(this);
    on(eventName, eventHandler) {
        this.eventManager.addEvent(eventName, eventHandler);
        return this;
    }
    once(eventName, eventHandler) {
        this.eventManager.addOnceEvent(eventName, eventHandler);
        return this;
    }
    hasEvent(eventName) {
        return this.eventManager.hasEvent(eventName);
    }
    off(eventName, eventHandler) {
        this.eventManager.removeEvent(eventName, eventHandler);
        return this;
    }
    emit(eventName, ...args) {
        return this.eventManager.emit(eventName, ...args);
    }
    bind(target, eventName, eventHandler) {
        this.eventManager.bind(target, eventName, eventHandler);
        return this;
    }
    remove() {
        this.eventManager.remove();
        delete this.eventManager;
    }
}
//# sourceMappingURL=EventContainer.js.map