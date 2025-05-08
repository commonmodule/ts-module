export default class TreeNode {
    parent;
    children = [];
    appendTo(parent, index) {
        if (this.isRemoved())
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
    clear(...except) {
        let i = 0;
        while (this.children.length > except.length) {
            const c = this.children[i];
            !except.includes(c) ? c.remove() : i++;
        }
        return this;
    }
    remove() {
        if (this.isRemoved())
            throw new Error("Node is already removed");
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1)
                this.parent.children.splice(index, 1);
            this.parent = undefined;
        }
        this.clear();
        delete this.children;
    }
    isRemoved() {
        return this.children === undefined;
    }
}
//# sourceMappingURL=TreeNode.js.map