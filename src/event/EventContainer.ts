import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";

export type WithDefaultHandlers<E> = E & { remove: () => void };

export default class EventContainer<E extends EventHandlers>
  implements IEventContainer<WithDefaultHandlers<E>> {
  private eventHandlers: {
    [K in keyof WithDefaultHandlers<E>]?: WithDefaultHandlers<E>[K][];
  } = {};

  private subscriptions: Array<{
    target: IEventContainer<Record<string, (...args: any[]) => any>>;
    eventName: string;
    handler: (...args: any[]) => any;
    removeHandler: () => void;
  }> = [];

  public on<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = [];
    this.eventHandlers[eventName]!.push(eventHandler);
    return this;
  }

  public off<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    const eventHandlers = this.eventHandlers[eventName];
    if (!eventHandlers) return this;
    if (!eventHandler) delete this.eventHandlers[eventName];
    else {
      const index = eventHandlers.indexOf(eventHandler);
      if (index !== -1) eventHandlers.splice(index, 1);
      if (eventHandlers.length === 0) delete this.eventHandlers[eventName];
    }
    return this;
  }

  protected hasEvent<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
  ): boolean {
    const events = this.eventHandlers[eventName];
    if (!events) return false;
    return events.length > 0;
  }

  protected async emit<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    ...args: Parameters<WithDefaultHandlers<E>[K]>
  ): Promise<ReturnType<WithDefaultHandlers<E>[K]>[]> {
    const eventHandlers = this.eventHandlers[eventName];
    if (!eventHandlers) return [];

    const results: ReturnType<WithDefaultHandlers<E>[K]>[] = [];
    const promises: Promise<ReturnType<WithDefaultHandlers<E>[K]>>[] = [];

    for (const handler of eventHandlers) {
      const result = handler(...args);
      if (result instanceof Promise) promises.push(result);
      else results.push(result);
    }

    return results.concat(await Promise.all(promises));
  }

  /*public subscribe<
    E2 extends (Record<string, (...args: any[]) => any> & DefaultHandlers),
    K extends keyof E2,
  >(
    target: IEventContainer<E2>,
    eventName: K,
    handler: E2[K],
  ): this {
    target.on(eventName, handler);

    const removeHandler = () => {
      const findIndex = this.subscriptions.findIndex(
        (s) =>
          s.target === target && s.eventName === eventName &&
          s.handler === handler,
      );
      if (findIndex !== -1) this.subscriptions.splice(findIndex, 1);
    };

    target.on("remove", removeHandler);

    this.subscriptions.push({
      target,
      eventName: eventName as string,
      handler,
      removeHandler,
    });

    return this;
  }*/

  public remove() {
    if (!this.eventHandlers) {
      throw new Error("This container is already removed");
    }
    this.emit("remove", ...[] as Parameters<WithDefaultHandlers<E>["remove"]>);
    delete (this as any).eventHandlers;
  }
}
