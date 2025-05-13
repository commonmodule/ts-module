import EventHandlers from "./EventHandlers.js";
import { DefaultHandlers, WithDefaultHandlers } from "./EventManager.js";
import IEventContainer from "./IEventContainer.js";
export default class EventContainer<E extends EventHandlers = EventHandlers> implements IEventContainer<WithDefaultHandlers<E>> {
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
//# sourceMappingURL=EventContainer.d.ts.map