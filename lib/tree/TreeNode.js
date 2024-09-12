export default class TreeNode {
    parent;
    children = [];
    _appendTo(parent, index) {
        if (this.parent === parent) {
            const currentIndex = this.parent.children.indexOf(this);
            if (index !== undefined && index > currentIndex) {
                index--;
            }
            this.parent.children.splice(currentIndex, 1);
        }
        else if (this.parent) {
            this._remove();
        }
        this.parent = parent;
        if (index !== undefined && index >= 0 && index < parent.children.length) {
            parent.children.splice(index, 0, this);
        }
        else {
            parent.children.push(this);
        }
    }
    _remove() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1)
                this.parent.children.splice(index, 1);
            this.parent = undefined;
        }
    }
}
//# sourceMappingURL=TreeNode.js.map