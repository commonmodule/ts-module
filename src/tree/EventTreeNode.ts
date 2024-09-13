import EventContainer from "../event/EventContainer.js";

export default abstract class EventTreeNode<
  TT extends EventTreeNode<TT, ET>,
  ET extends Record<string, (...args: any[]) => any>,
> extends EventContainer<ET> {
  protected parent: TT | undefined;
  protected children: TT[] = [];
  protected removed = false;

  public appendTo(parent: TT, index?: number): this {
    if (this.parent === parent) {
      const currentIndex = this.parent.children.indexOf(this as unknown as TT);
      if (index !== undefined && index > currentIndex) {
        index--;
      }
      this.parent.children.splice(currentIndex, 1);
    } else if (this.parent) {
      this.remove();
    }

    this.parent = parent;

    if (index !== undefined && index >= 0 && index < parent.children.length) {
      parent.children.splice(index, 0, this as unknown as TT);
    } else {
      parent.children.push(this as unknown as TT);
    }

    return this;
  }

  public remove() {
    if (this.removed) return;
    this.removed = true;

    if (this.parent) {
      const index = this.parent.children.indexOf(this as unknown as TT);
      if (index > -1) this.parent.children.splice(index, 1);
      this.parent = undefined;
    }

    while (this.children.length > 0) {
      this.children[0].remove();
    }
  }
}
