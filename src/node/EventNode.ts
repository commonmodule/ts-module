import EventHandlers from "../event/EventHandlers.js";
import EventManager, {
  DefaultHandlers,
  WithDefaultHandlers,
} from "../event/EventManager.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";

export default abstract class EventNode<
  T extends Node<T>,
  E extends EventHandlers,
> extends Node<T> implements IEventContainer<WithDefaultHandlers<E>> {
  private eventManager = new EventManager<E>(this);

  public on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;

  public on<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public on<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    this.eventManager.addEvent(eventName, eventHandler);
    return this;
  }

  public once<K extends keyof E>(eventName: K, eventHandler: E[K]): this;

  public once<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public once<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    this.eventManager.addOnceEvent(eventName, eventHandler);
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
    this.eventManager.removeEvent(eventName, eventHandler);
    return this;
  }

  protected emit<K extends keyof E>(
    eventName: K,
    ...args: Parameters<E[K]>
  ): Promise<ReturnType<E[K]>[]>;

  protected emit<K extends keyof DefaultHandlers>(
    eventName: K,
    ...args: Parameters<DefaultHandlers[K]>
  ): Promise<ReturnType<DefaultHandlers[K]>[]>;

  protected emit<K extends keyof WithDefaultHandlers<E>>(
    eventName: K,
    ...args: Parameters<WithDefaultHandlers<E>[K]>
  ): Promise<ReturnType<WithDefaultHandlers<E>[K]>[]> {
    return this.eventManager.emit(eventName, ...args);
  }

  public bind<K extends keyof E>(
    target: IEventContainer,
    eventName: K,
    eventHandler: E[K],
  ): this;

  public bind<K extends keyof DefaultHandlers>(
    target: IEventContainer,
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public bind<K extends keyof WithDefaultHandlers<E>>(
    target: IEventContainer,
    eventName: K,
    eventHandler: WithDefaultHandlers<E>[K],
  ): this {
    this.eventManager.bind(target, eventName, eventHandler);
    return this;
  }

  public remove() {
    this.eventManager.remove();
    delete (this as any).eventManager;

    super.remove();
  }
}
