import EventContainer from "../event/EventContainer.js";
import Node from "./Node.js";
export default class EventNode extends Node {
    eventContainer = new EventContainer();
    on(eventName, eventHandler) {
        this.eventContainer.on(eventName, eventHandler);
        return this;
    }
    off(eventName, eventHandler) {
        this.eventContainer.off(eventName, eventHandler);
        return this;
    }
    hasEvent(eventName) {
        return this.eventContainer["hasEvent"](eventName);
    }
    async emit(eventName, ...args) {
        return this.eventContainer["emit"](eventName, ...args);
    }
    bind(eventName, target, eventHandler) {
        this.eventContainer.bind(eventName, target, eventHandler);
        return this;
    }
    remove() {
        this.eventContainer.remove();
        super.remove();
    }
}
//# sourceMappingURL=EventNode.js.map