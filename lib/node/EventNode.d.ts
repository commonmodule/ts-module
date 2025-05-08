import { DefaultHandlers, WithDefaultHandlers } from "../event/EventContainer.js";
import EventHandlers from "../event/EventHandlers.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";
export default abstract class EventNode<T extends Node<T>, E extends EventHandlers> extends Node<T> implements IEventContainer<WithDefaultHandlers<E>> {
    private readonly eventContainer;
    on<K extends keyof WithDefaultHandlers<E>>(eventName: K, handler: WithDefaultHandlers<E>[K]): this;
    protected hasEvent<K extends keyof WithDefaultHandlers<E>>(eventName: K): boolean;
    protected emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>;
    protected emit<K extends keyof DefaultHandlers>(eventName: K, ...args: Parameters<DefaultHandlers[K]>): Promise<ReturnType<DefaultHandlers[K]>[]>;
    remove(): void;
}
//# sourceMappingURL=EventNode.d.ts.map