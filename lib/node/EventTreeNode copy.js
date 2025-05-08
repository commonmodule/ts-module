import EventContainer from "../event/EventContainer.js";
import TreeNode from "./TreeNode.js";
export default class EventTreeNode extends TreeNode {
    eventContainer = new EventContainer();
    on(eventName, handler) {
        this.eventContainer.on(eventName, handler);
        return this;
    }
    emit(eventName, ...args) {
        this.eventContainer["emit"](eventName, ...args);
        return this;
    }
    remove() {
        this.eventContainer.remove();
        super.remove();
    }
}
//# sourceMappingURL=EventTreeNode%20copy.js.map