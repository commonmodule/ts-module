import EventContainer from "../event/EventContainer.js";
import TreeNode from "./TreeNode.js";
export default class EventTreeNode extends TreeNode {
    events = new EventContainer();
    subscriptions = [];
    on(eventName, handler) {
        this.events.on(eventName, handler);
        return this;
    }
    off(eventName, handler) {
        this.events.off(eventName, handler);
        return this;
    }
    hasEvent(eventName) {
        return this.events["hasEvent"](eventName);
    }
    emit(eventName, ...args) {
        return this.events["emit"](eventName, ...args);
    }
    subscribe(target, eventName, handler) {
        target.on(eventName, handler);
        target.on("remove", () => {
            const findIndex = this.subscriptions.findIndex((s) => s.target === target && s.eventName === eventName &&
                s.handler === handler);
            if (findIndex !== -1)
                this.subscriptions.splice(findIndex, 1);
        });
        this.subscriptions.push({
            target,
            eventName: eventName,
            handler,
        });
        return this;
    }
    remove() {
        if (this.removed)
            return;
        this.emit("remove", ...[]);
        this.events["clearEvents"]();
        for (const s of this.subscriptions)
            s.target.off(s.eventName, s.handler);
        delete this.subscriptions;
        super.remove();
    }
}
//# sourceMappingURL=EventTreeNode.js.map