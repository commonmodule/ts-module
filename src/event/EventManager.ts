import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";

export type DefaultHandlers = { remove: () => void };
export type WithDefaultHandlers<E> = E & DefaultHandlers;

export default class EventManager<E extends EventHandlers> {
  private eventHandlers: {
    [K in keyof WithDefaultHandlers<E>]?: WithDefaultHandlers<E>[K][];
  } = {};

  private bindings: Array<{
    eventName: string;
    target: IEventContainer;
    eventHandler: (...args: any[]) => any;
    removeHandler: () => void;
  }> = [];

  constructor(private eventContainer: IEventContainer<E>) {}

  public addEvent<K extends keyof E>(eventName: K, eventHandler: E[K]): void;

  public addEvent<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): void;

  public addEvent<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): void {
    if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = [];
    this.eventHandlers[eventName]!.push(eventHandler);
  }

  public removeEvent<K extends keyof E>(
    eventName: K,
    eventHandler?: E[K],
  ): void;

  public removeEvent<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler?: DefaultHandlers[K],
  ): void;

  public removeEvent<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler?: WithDefaultHandlers<E>[K],
  ): void {
    const eventHandlers = this.eventHandlers[eventName];
    if (!eventHandlers) return;
    if (!eventHandler) delete this.eventHandlers[eventName];
    else {
      const index = eventHandlers.indexOf(eventHandler);
      if (index !== -1) eventHandlers.splice(index, 1);
      if (eventHandlers.length === 0) delete this.eventHandlers[eventName];
    }
  }

  public emit<K extends keyof E>(
    eventName: K,
    ...args: Parameters<E[K]>
  ): Promise<ReturnType<E[K]>[]>;

  public emit<K extends keyof DefaultHandlers>(
    eventName: K,
    ...args: Parameters<DefaultHandlers[K]>
  ): Promise<ReturnType<DefaultHandlers[K]>[]>;

  public async emit<K extends keyof WithDefaultHandlers<E>>(
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
    target: IEventContainer,
    eventName: K,
    eventHandler: E[K],
  ): void;

  public bind<K extends keyof DefaultHandlers>(
    target: IEventContainer,
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): void;

  public bind<K extends keyof WithDefaultHandlers<E>>(
    target: IEventContainer,
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): void {
    this.eventContainer.on(eventName, eventHandler);

    const removeHandler = () => {
      this.eventContainer.off(eventName, eventHandler);

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
