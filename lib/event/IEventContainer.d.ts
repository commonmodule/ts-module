import EventHandlers from "./EventHandlers.js";
export default interface IEventContainer<E extends EventHandlers> {
    on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
}
//# sourceMappingURL=IEventContainer.d.ts.map