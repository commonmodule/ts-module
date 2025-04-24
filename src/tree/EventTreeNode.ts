import EventContainer from "../event/EventContainer.js";
import EventRecord from "../event/EventRecord.js";
import TreeNode from "./TreeNode.js";

export default abstract class EventTreeNode<
  T extends EventTreeNode<T, E>,
  E extends EventRecord,
> extends TreeNode<T> {
  private readonly events = new EventContainer<E & { remove: () => void }>();

  private subscriptions: Array<{
    target: EventTreeNode<any, EventRecord>;
    eventName: string;
    handler: (...args: any[]) => any;
  }> = [];

  public on<K extends keyof (E & { remove: () => void })>(
    eventName: K,
    handler: (E & { remove: () => void })[K],
  ): this {
    this.events.on(eventName, handler);
    return this;
  }

  public off<K extends keyof (E & { remove: () => void })>(
    eventName: K,
    handler?: (E & { remove: () => void })[K],
  ): this {
    this.events.off(eventName, handler);
    return this;
  }

  protected hasEvent<K extends keyof E>(eventName: K): boolean {
    return this.events["hasEvent"](eventName);
  }

  protected emit<K extends keyof (E & { remove: () => void })>(
    eventName: K,
    ...args: Parameters<(E & { remove: () => void })[K]>
  ) {
    return this.events["emit"](eventName, ...args);
  }

  public subscribe<
    E2 extends (EventRecord & { remove: () => void }),
    K extends keyof E2,
  >(
    target: EventTreeNode<any, E2>,
    eventName: K,
    handler: E2[K],
  ): this {
    target.on(eventName, handler);

    target.on("remove", () => {
      const findIndex = this.subscriptions.findIndex(
        (s) =>
          s.target === target && s.eventName === eventName &&
          s.handler === handler,
      );
      if (findIndex !== -1) this.subscriptions.splice(findIndex, 1);
    });

    this.subscriptions.push({
      target,
      eventName: eventName as string,
      handler,
    });

    return this;
  }

  public override remove(): void {
    if (this.removed) return;

    this.emit(
      "remove",
      ...([] as Parameters<(E & { remove: () => void })["remove"]>),
    );

    this.events["clearEvents"]();
    for (const s of this.subscriptions) s.target.off(s.eventName, s.handler);

    super.remove();
  }
}
