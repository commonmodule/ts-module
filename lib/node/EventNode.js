import EventContainer from "../event/EventContainer.js";
import Node from "./Node.js";
export default class EventNode extends Node {
    eventContainer = new EventContainer();
    on(eventName, handler) {
        this.eventContainer.on(eventName, handler);
        return this;
    }
    hasEvent(eventName) {
        return this.eventContainer["hasEvent"](eventName);
    }
    async emit(eventName, ...args) {
        return this.eventContainer["emit"](eventName, ...args);
    }
    remove() {
        this.eventContainer.remove();
        super.remove();
    }
}
//# sourceMappingURL=EventNode.js.map