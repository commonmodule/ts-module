import EventContainer from "../event/EventContainer.js";

export default abstract class EventTreeNode<
  T extends EventTreeNode<T, E>,
  E extends Record<string, (...args: any[]) => any>,
> extends EventContainer<E & { remove: () => void }> {
  protected parent: T | undefined;
  public children: T[] = [];
  protected removed = false;

  private subscriptions: Array<{
    container: EventContainer<any>;
    eventName: string;
    handler: (...args: any[]) => any;
  }> = [];

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

  public subscribe<
    E extends Record<string, (...args: any[]) => any>,
    K extends keyof E,
  >(
    container: EventContainer<E>,
    eventName: K,
    handler: E[K],
  ): this {
    container.on(eventName, handler);
    this.subscriptions.push({
      container,
      eventName: eventName as string,
      handler,
    });
    return this;
  }

  public clear(...except: (T | undefined)[]): this {
    let i = 0;
    while (this.children.length > except.length) {
      const child = this.children[i];
      !except.includes(child) ? child.remove() : i++;
    }
    return this;
  }

  public remove(): void {
    if (this.removed) return;
    this.removed = true;

    this.emit(
      "remove",
      ...([] as Parameters<(E & { remove: () => void })["remove"]>),
    );
    this.clearEvents();

    for (const sub of this.subscriptions) {
      sub.container.off(sub.eventName, sub.handler);
    }
    delete (this as any).subscriptions;

    if (this.parent) {
      const index = this.parent.children.indexOf(this as unknown as T);
      if (index > -1) this.parent.children.splice(index, 1);
      this.parent = undefined;
    }

    this.clear();
    delete (this as any).children;
  }
}
