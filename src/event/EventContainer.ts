import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";

export type DefaultHandlers = { remove: () => void };
export type WithDefaultHandlers<E> = E & DefaultHandlers;

export default class EventContainer<E extends EventHandlers>
  implements IEventContainer<WithDefaultHandlers<E>> {
  private eventHandlers: {
    [K in keyof WithDefaultHandlers<E>]?: WithDefaultHandlers<E>[K][];
  } = {};

  private bindings: Array<{
    eventName: string;
    target: IEventContainer<EventHandlers>;
    eventHandler: (...args: any[]) => any;
    removeHandler: () => void;
  }> = [];

  public on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;

  public on<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public on<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = [];
    this.eventHandlers[eventName]!.push(eventHandler);
    return this;
  }

  public off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this;

  public off<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler?: DefaultHandlers[K],
  ): this;

  public off<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler?: WithDefaultHandlers<E>[K],
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

  protected hasEvent<K extends keyof E>(eventName: K): boolean;

  protected hasEvent<K extends keyof DefaultHandlers>(
    eventName: K,
  ): boolean;

  protected hasEvent<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
  ): boolean {
    const events = this.eventHandlers[eventName];
    if (!events) return false;
    return events.length > 0;
  }

  protected async emit<K extends keyof E>(
    eventName: K,
    ...args: Parameters<E[K]>
  ): Promise<ReturnType<E[K]>[]>;

  protected async emit<K extends keyof DefaultHandlers>(
    eventName: K,
    ...args: Parameters<DefaultHandlers[K]>
  ): Promise<ReturnType<DefaultHandlers[K]>[]>;

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

  public bind<K extends keyof E>(
    eventName: K,
    target: IEventContainer<EventHandlers>,
    eventHandler: E[K],
  ): this;

  public bind<K extends keyof DefaultHandlers>(
    eventName: K,
    target: IEventContainer<EventHandlers>,
    eventHandler: DefaultHandlers[K],
  ): this;

  public bind<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    target: IEventContainer<EventHandlers>,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    this.on(eventName, eventHandler);

    const removeHandler = () => {
      this.off(eventName, eventHandler);

      const findIndex = this.bindings.findIndex(
        (b) =>
          b.target === target && b.eventName === eventName &&
          b.eventHandler === eventHandler,
      );
      if (findIndex !== -1) this.bindings.splice(findIndex, 1);
    };

    target.on("remove", removeHandler);

    this.bindings.push({
      eventName: eventName as string,
      target,
      eventHandler,
      removeHandler,
    });

    return this;
  }

  public remove() {
    if (!this.eventHandlers) {
      throw new Error("This container is already removed");
    }

    this.emit("remove");
    delete (this as any).eventHandlers;

    for (const binding of this.bindings) {
      binding.target.off("remove", binding.removeHandler);
    }
    delete (this as any).bindings;
  }
}
