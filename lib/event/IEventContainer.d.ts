import EventHandlers from "./EventHandlers.js";
export default interface IEventContainer<E> {
    on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
    off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this;
    bind<K extends keyof E>(target: IEventContainer<EventHandlers>, eventName: K, eventHandler: E[K]): this;
}
//# sourceMappingURL=IEventContainer.d.ts.map