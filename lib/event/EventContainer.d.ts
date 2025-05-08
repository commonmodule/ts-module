import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";
export type WithDefaultHandlers<E> = E & {
    remove: () => void;
};
export default class EventContainer<E extends EventHandlers> implements IEventContainer<WithDefaultHandlers<E>> {
    private eventHandlers;
    private subscriptions;
    on<K extends keyof WithDefaultHandlers<E>>(eventName: K, eventHandler: WithDefaultHandlers<E>[K]): this;
    off<K extends keyof WithDefaultHandlers<E>>(eventName: K, eventHandler: WithDefaultHandlers<E>[K]): this;
    protected hasEvent<K extends keyof WithDefaultHandlers<E>>(eventName: K): boolean;
    protected emit<K extends keyof WithDefaultHandlers<E>>(eventName: K, ...args: Parameters<WithDefaultHandlers<E>[K]>): Promise<ReturnType<WithDefaultHandlers<E>[K]>[]>;
    remove(): void;
}
//# sourceMappingURL=EventContainer.d.ts.map