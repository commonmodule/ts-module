import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";
export type DefaultHandlers = {
    remove: () => void;
};
export type WithDefaultHandlers<E> = E & DefaultHandlers;
export default class EventContainer<E extends EventHandlers> implements IEventContainer<WithDefaultHandlers<E>> {
    private eventHandlers;
    private bindings;
    on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
    on<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): this;
    off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this;
    off<K extends keyof DefaultHandlers>(eventName: K, eventHandler?: DefaultHandlers[K]): this;
    protected hasEvent<K extends keyof E>(eventName: K): boolean;
    protected hasEvent<K extends keyof DefaultHandlers>(eventName: K): boolean;
    protected emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>;
    protected emit<K extends keyof DefaultHandlers>(eventName: K, ...args: Parameters<DefaultHandlers[K]>): Promise<ReturnType<DefaultHandlers[K]>[]>;
    bind<K extends keyof E>(eventName: K, target: IEventContainer<EventHandlers>, eventHandler: E[K]): this;
    bind<K extends keyof DefaultHandlers>(eventName: K, target: IEventContainer<EventHandlers>, eventHandler: DefaultHandlers[K]): this;
    remove(): void;
}
//# sourceMappingURL=EventContainer.d.ts.map