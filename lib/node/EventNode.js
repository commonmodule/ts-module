import EventManager from "../event/EventManager.js";
import Node from "./Node.js";
export default class EventNode extends Node {
    eventManager = new EventManager(this);
    on(eventName, eventHandler) {
        this.eventManager.addEvent(eventName, eventHandler);
        return this;
    }
    once(eventName, eventHandler) {
        this.eventManager.addOnceEvent(eventName, eventHandler);
        return this;
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
        super.remove();
    }
}
//# sourceMappingURL=EventNode.js.map