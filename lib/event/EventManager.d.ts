import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";
export type DefaultHandlers = {
    remove: () => void;
};
export type WithDefaultHandlers<E> = E & DefaultHandlers;
export default class EventManager<E extends EventHandlers> {
    private eventContainer;
    private events;
    private bindings;
    constructor(eventContainer: IEventContainer<E>);
    addEvent<K extends keyof E>(eventName: K, eventHandler: E[K]): void;
    addEvent<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): void;
    addOnceEvent<K extends keyof E>(eventName: K, eventHandler: E[K]): void;
    addOnceEvent<K extends keyof DefaultHandlers>(eventName: K, eventHandler: DefaultHandlers[K]): void;
    hasEvent<K extends keyof E>(eventName: K): boolean;
    hasEvent<K extends keyof DefaultHandlers>(eventName: K): boolean;
    removeEvent<K extends keyof E>(eventName: K, eventHandler?: E[K]): void;
    removeEvent<K extends keyof DefaultHandlers>(eventName: K, eventHandler?: DefaultHandlers[K]): void;
    emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>;
    emit<K extends keyof DefaultHandlers>(eventName: K, ...args: Parameters<DefaultHandlers[K]>): Promise<ReturnType<DefaultHandlers[K]>[]>;
    bind<K extends keyof E>(target: IEventContainer, eventName: K, eventHandler: E[K]): void;
    bind<K extends keyof DefaultHandlers>(target: IEventContainer, eventName: K, eventHandler: DefaultHandlers[K]): void;
    remove(): void;
}
//# sourceMappingURL=EventManager.d.ts.map