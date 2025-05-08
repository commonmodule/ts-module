import IEventContainer from "./IEventContainer.js";
export type DefaultHandlers = {
    remove: () => void;
};
export type EventContainerHandlers<E> = Omit<E, keyof DefaultHandlers>;
export type WithDefaultHandlers<E> = E & DefaultHandlers;
export default class EventContainer<E extends EventContainerHandlers<E>> implements IEventContainer<E> {
    private eventHandlers;
    private subscriptions;
    on<K extends keyof WithDefaultHandlers<E>>(eventName: K, eventHandler: WithDefaultHandlers<E>[K]): this;
    off<K extends keyof WithDefaultHandlers<E>>(eventName: K, eventHandler: WithDefaultHandlers<E>[K]): this;
    protected hasEvent<K extends keyof WithDefaultHandlers<E>>(eventName: K): boolean;
    protected emit<K extends keyof WithDefaultHandlers<E>>(eventName: K, ...args: Parameters<WithDefaultHandlers<E>[K]>[]): Promise<ReturnType<WithDefaultHandlers<E>[K]>[]>;
    subscribe<E2 extends (Record<string, (...args: any[]) => any> & DefaultHandlers), K extends keyof E2>(target: IEventContainer<E2>, eventName: K, handler: E2[K]): this;
    remove(): void;
}
//# sourceMappingURL=EventContainer.d.ts.map