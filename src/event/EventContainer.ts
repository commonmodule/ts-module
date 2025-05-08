import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";

export type DefaultEvents = { remove: () => void };

export default class EventContainer<E extends EventHandlers>
  implements IEventContainer<E> {
  private eventHandlers: {
    [K in keyof (E & DefaultEvents)]?: (E & DefaultEvents)[K][];
  } = {};

  private subscriptions: Array<{
    target: IEventContainer<EventHandlers>;
    eventName: string;
    handler: (...args: any[]) => any;
    removeHandler: () => void;
  }> = [];

  public on<K extends keyof (E & DefaultEvents)>(
    eventName: K,
    eventHandler: (E & DefaultEvents)[K],
  ): this {
    if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = [];
    this.eventHandlers[eventName]!.push(eventHandler);
    return this;
  }

  public off<K extends keyof (E & DefaultEvents)>(
    eventName: K,
    eventHandler: (E & DefaultEvents)[K],
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

  protected async emit<K extends keyof (E & DefaultEvents)>(
    eventName: K,
    ...args: Parameters<(E & DefaultEvents)[K]>
  ): Promise<ReturnType<(E & DefaultEvents)[K]>[]> {
    const eventHandlers = this.eventHandlers[eventName];
    if (!eventHandlers) return [];

    const results: ReturnType<E[K]>[] = [];
    const promises: Promise<ReturnType<E[K]>>[] = [];

    for (const handler of eventHandlers) {
      const result = handler(...args);
      if (result instanceof Promise) promises.push(result);
      else results.push(result);
    }

    return results.concat(await Promise.all(promises));
  }

  public subscribe<
    E2 extends (EventHandlers & DefaultEvents),
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
  }

  public remove() {
    if (!this.eventHandlers) {
      throw new Error("This container is already removed");
    }
    this.emit(
      "remove",
      ...([] as Parameters<(E & { remove: () => void })["remove"]>),
    );
    delete (this as any).eventHandlers;
  }
}
