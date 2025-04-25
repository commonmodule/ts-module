import EventRecord from "./EventRecord.js";
export default class EventContainer<E extends EventRecord = {}> {
    private events;
    on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
    off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this;
    protected hasEvent<K extends keyof E>(eventName: K): boolean;
    protected emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>;
    protected clearEvents(): void;
}
//# sourceMappingURL=EventContainer.d.ts.map