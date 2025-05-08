import EventContainer, {
  EventContainerHandlers,
  WithDefaultHandlers,
} from "../event/EventContainer.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";

export default abstract class EventNode<
  T extends Node<T>,
  E extends EventContainerHandlers<E>,
> extends Node<T> implements IEventContainer<E> {
  private readonly eventContainer = new EventContainer<E>();

  public on<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    handler: WithDefaultHandlers<E>[K],
  ): this {
    this.eventContainer.on(eventName, handler);
    return this;
  }

  protected hasEvent<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
  ): boolean {
    return this.eventContainer["hasEvent"](eventName);
  }

  protected emit<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    ...args: Parameters<WithDefaultHandlers<E>[K]>[]
  ): this {
    this.eventContainer["emit"](eventName, ...args);
    return this;
  }

  public remove(): void {
    this.eventContainer.remove();
    super.remove();
  }
}
