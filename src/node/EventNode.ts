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

  public on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;

  public on<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public on<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    this.eventContainer.on(eventName, eventHandler);
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
    this.eventContainer.off(eventName, eventHandler);
    return this;
  }

  protected hasEvent<K extends keyof E>(eventName: K): boolean;

  protected hasEvent<K extends keyof DefaultHandlers>(
    eventName: K,
  ): boolean;

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

  public bind<K extends keyof E>(
    eventName: K,
    eventHandler: E[K],
    target: IEventContainer<EventHandlers>,
  ): this;

  public bind<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
    target: IEventContainer<EventHandlers>,
  ): this;

  public bind<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
    target: IEventContainer<EventHandlers>,
  ): this {
    this.eventContainer.bind(eventName, target, eventHandler);
    return this;
  }

  public remove(): void {
    this.eventContainer.remove();
    super.remove();
  }
}
