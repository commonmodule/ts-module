import EventContainer from "../event/EventContainer.js";

export default abstract class EventTreeNode<
  TT extends EventTreeNode<TT, ET>,
  ET extends Record<string, (...args: any[]) => any>,
> extends EventContainer<ET> {
  protected parent: TT | undefined;
  public children: TT[] = [];
  protected removed = false;

  private subscriptions: Array<{
    container: EventContainer<any>;
    eventName: string;
    handler: (...args: any[]) => any;
  }> = [];

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

  protected subscribe<
    T extends Record<string, (...args: any[]) => any>,
    K extends keyof T,
  >(
    container: EventContainer<T>,
    eventName: K,
    handler: T[K],
  ): this {
    container.on(eventName, handler);
    this.subscriptions.push({
      container,
      eventName: eventName as string,
      handler,
    });
    return this;
  }

  private unsubscribeFromAll(): void {
    for (const sub of this.subscriptions) {
      sub.container.off(sub.eventName, sub.handler);
    }
    this.subscriptions = [];
  }

  public remove(): void {
    if (this.removed) return;
    this.removed = true;

    this.unsubscribeFromAll();

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
