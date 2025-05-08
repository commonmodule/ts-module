import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";
export type DefaultHandlers = {
    remove: () => void;
};
export type WithDefaultHandlers<E> = E & DefaultHandlers;
export default class EventContainer<E extends EventHandlers> implements IEventContainer<WithDefaultHandlers<E>> {
    private eventHandlers;
    private subscriptions;
    on<K extends keyof WithDefaultHandlers<E>>(eventName: K, eventHandler: WithDefaultHandlers<E>[K]): this;
    off<K extends keyof WithDefaultHandlers<E>>(eventName: K, eventHandler: WithDefaultHandlers<E>[K]): this;
    protected hasEvent<K extends keyof WithDefaultHandlers<E>>(eventName: K): boolean;
    protected emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>;
    protected emit<K extends keyof DefaultHandlers>(eventName: K, ...args: Parameters<DefaultHandlers[K]>): Promise<ReturnType<DefaultHandlers[K]>[]>;
    remove(): void;
}
//# sourceMappingURL=EventContainer.d.ts.map