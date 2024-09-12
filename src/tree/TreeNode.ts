import Constructor from "../mixin/Constructor.js";

export type TreeNodeType<T extends TreeNodeType<T>> = {
  parent: T | undefined;
  children: T[];
  appendTo(parent: T, index?: number): void;
  remove(): void;
};

export function TreeNodeMixin<CT extends Constructor>(Base: CT) {
  return class extends Base implements TreeNodeType<any> {
    parent: any | undefined;
    children: any[] = [];

    appendTo(parent: any, index?: number): void {
      if (this.parent === parent) {
        const currentIndex = this.parent.children.indexOf(this);
        if (index !== undefined && index > currentIndex) {
          index--;
        }
        this.parent.children.splice(currentIndex, 1);
      } else if (this.parent) {
        this.remove();
      }

      this.parent = parent;

      if (index !== undefined && index >= 0 && index < parent.children.length) {
        parent.children.splice(index, 0, this);
      } else {
        parent.children.push(this);
      }
    }

    remove(): void {
      if (this.parent) {
        const index = this.parent.children.indexOf(this);
        if (index > -1) this.parent.children.splice(index, 1);
        this.parent = undefined;
      }
    }
  };
}

export default abstract class TreeNode<T extends TreeNode<T>>
  extends TreeNodeMixin(Object)
  implements TreeNodeType<T> {
  declare parent: T | undefined;
  declare children: T[];
  declare appendTo: (parent: T, index?: number) => void;
  declare remove: () => void;
}
