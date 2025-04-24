export default abstract class TreeNode<T extends TreeNode<T>> {
  protected parent: T | undefined;
  public children: T[] = [];

  protected removed = false;

  public appendTo(parent: T, index?: number): this {
    if (this.removed) throw new Error("Node is removed");

    if (this.parent === parent) {
      const currentIndex = this.parent.children.indexOf(this as unknown as T);
      if (index !== undefined && index > currentIndex) {
        index--;
      }
      this.parent.children.splice(currentIndex, 1);
    } else if (this.parent) {
      this.remove();
    }

    this.parent = parent;

    if (index !== undefined && index >= 0 && index < parent.children.length) {
      parent.children.splice(index, 0, this as unknown as T);
    } else {
      parent.children.push(this as unknown as T);
    }

    return this;
  }

  public clear(...except: (T | undefined)[]): this {
    let i = 0;
    while (this.children.length > except.length) {
      const c = this.children[i];
      !except.includes(c) ? c.remove() : i++;
    }
    return this;
  }

  public remove(): void {
    if (this.removed) return;
    this.removed = true;

    if (this.parent) {
      const index = this.parent.children.indexOf(this as unknown as T);
      if (index > -1) this.parent.children.splice(index, 1);
      this.parent = undefined;
    }

    this.clear();
    delete (this as any).children;
  }
}
