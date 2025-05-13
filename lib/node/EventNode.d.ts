import EventHandlers from "../event/EventHandlers.js";
import { DefaultHandlers, WithDefaultHandlers } from "../event/EventManager.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";
export default abstract class EventNode<T extends Node<T>, E extends EventHandlers> extends Node<T> implements IEventContainer<WithDefaultHandlers<E>> {
    private eventManager;
    on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
    on<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    once<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
    once<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    hasEvent<K extends keyof E>(eventName: K): boolean;
    hasEvent<K extends keyof DefaultHandlers>(eventName: K): boolean;
    off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this;
    off<K extends keyof DefaultHandlers>(eventName: K, eventHandler?: DefaultHandlers[K]): this;
    protected emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>;
    protected emit<K extends keyof DefaultHandlers>(eventName: K, ...args: Parameters<DefaultHandlers[K]>): Promise<ReturnType<DefaultHandlers[K]>[]>;
    bind<K extends keyof E>(target: IEventContainer, eventName: K, eventHandler: E[K]): this;
    bind<K extends keyof DefaultHandlers>(target: IEventContainer, eventName: K, eventHandler: DefaultHandlers[K]): this;
    remove(): void;
}
//# sourceMappingURL=EventNode.d.ts.map