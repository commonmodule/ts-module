import EventContainer from "../event/EventContainer.js";
export default class EventTreeNode extends EventContainer {
    parent;
    children = [];
    removed = false;
    subscriptions = [];
    appendTo(parent, index) {
        if (this.removed)
            throw new Error("Node is removed");
        if (this.parent === parent) {
            const currentIndex = this.parent.children.indexOf(this);
            if (index !== undefined && index > currentIndex) {
                index--;
            }
            this.parent.children.splice(currentIndex, 1);
        }
        else if (this.parent) {
            this.remove();
        }
        this.parent = parent;
        if (index !== undefined && index >= 0 && index < parent.children.length) {
            parent.children.splice(index, 0, this);
        }
        else {
            parent.children.push(this);
        }
        return this;
    }
    subscribe(container, eventName, handler) {
        container.on(eventName, handler);
        this.subscriptions.push({
            container,
            eventName: eventName,
            handler,
        });
        return this;
    }
    unsubscribeFromAll() {
        for (const sub of this.subscriptions) {
            sub.container.off(sub.eventName, sub.handler);
        }
        this.subscriptions = [];
    }
    clear(...except) {
        this.children.forEach((child) => {
            if (!except.includes(child))
                child.remove();
        });
        return this;
    }
    remove() {
        if (this.removed)
            return;
        this.removed = true;
        this.unsubscribeFromAll();
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1)
                this.parent.children.splice(index, 1);
            this.parent = undefined;
        }
        this.clear();
    }
}
//# sourceMappingURL=EventTreeNode.js.map