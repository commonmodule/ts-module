import EventContainer, { DefaultEvents } from "../event/EventContainer.js";
import EventHandlers from "../event/EventHandlers.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";

export default abstract class EventNode<
  T extends EventNode<T, E>,
  E extends EventHandlers,
> extends Node<T> implements IEventContainer<E> {
  private readonly eventContainer = new EventContainer<E>();

  public on<K extends keyof (E & DefaultEvents)>(
    eventName: K,
    handler: (E & DefaultEvents)[K],
  ): this {
    this.eventContainer.on(eventName, handler);
    return this;
  }

  protected emit<K extends keyof (E & DefaultEvents)>(
    eventName: K,
    ...args: Parameters<(E & DefaultEvents)[K]>
  ): this {
    this.eventContainer["emit"](eventName, ...args);
    return this;
  }

  public remove(): void {
    this.eventContainer.remove();
    super.remove();
  }
}
