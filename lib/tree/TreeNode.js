export default class TreeNode {
    parent;
    children = [];
    removed = false;
    appendTo(parent, index) {
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
    remove() {
        if (this.removed)
            return;
        this.removed = true;
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1)
                this.parent.children.splice(index, 1);
            this.parent = undefined;
        }
        while (this.children.length > 0) {
            this.children[0].remove();
        }
    }
}
//# sourceMappingURL=TreeNode.js.map