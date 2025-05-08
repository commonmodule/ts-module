import EventContainer, {
  DefaultHandlers,
  WithDefaultHandlers,
} from "../event/EventContainer.js";
import EventHandlers from "../event/EventHandlers.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";

export default abstract class EventNode<
  T extends Node<T>,
  E extends EventHandlers,
> extends Node<T> implements IEventContainer<WithDefaultHandlers<E>> {
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
    return this.eventContainer["emit"](eventName, ...args);
  }

  public remove(): void {
    this.eventContainer.remove();
    super.remove();
  }
}
