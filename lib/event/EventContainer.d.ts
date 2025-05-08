import EventHandlers from "./EventHandlers.js";
import IEventContainer from "./IEventContainer.js";
export type DefaultEvents = {
    remove: () => void;
};
export default class EventContainer<E extends EventHandlers> implements IEventContainer<E> {
    private eventHandlers;
    private subscriptions;
    on<K extends keyof (E & DefaultEvents)>(eventName: K, eventHandler: (E & DefaultEvents)[K]): this;
    off<K extends keyof (E & DefaultEvents)>(eventName: K, eventHandler: (E & DefaultEvents)[K]): this;
    protected emit<K extends keyof (E & DefaultEvents)>(eventName: K, ...args: Parameters<(E & DefaultEvents)[K]>): Promise<ReturnType<(E & DefaultEvents)[K]>[]>;
    subscribe<E2 extends (EventHandlers & DefaultEvents), K extends keyof E2>(target: IEventContainer<E2>, eventName: K, handler: E2[K]): this;
    remove(): void;
}
//# sourceMappingURL=EventContainer.d.ts.map