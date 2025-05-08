import { EventContainerHandlers, WithDefaultHandlers } from "../event/EventContainer.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";
export default abstract class EventNode<T extends Node<T>, E extends EventContainerHandlers<E>> extends Node<T> implements IEventContainer<E> {
    private readonly eventContainer;
    on<K extends keyof WithDefaultHandlers<E>>(eventName: K, handler: WithDefaultHandlers<E>[K]): this;
    protected hasEvent<K extends keyof WithDefaultHandlers<E>>(eventName: K): boolean;
    protected emit<K extends keyof WithDefaultHandlers<E>>(eventName: K, ...args: Parameters<WithDefaultHandlers<E>[K]>[]): this;
    remove(): void;
}
//# sourceMappingURL=EventNode.d.ts.map