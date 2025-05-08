import { DefaultEvents } from "../event/EventContainer.js";
import EventHandlers from "../event/EventHandlers.js";
import IEventContainer from "../event/IEventContainer.js";
import Node from "./Node.js";
export default abstract class EventNode<T extends EventNode<T, E>, E extends EventHandlers> extends Node<T> implements IEventContainer<E> {
    private readonly eventContainer;
    on<K extends keyof (E & DefaultEvents)>(eventName: K, handler: (E & DefaultEvents)[K]): this;
    protected emit<K extends keyof (E & DefaultEvents)>(eventName: K, ...args: Parameters<(E & DefaultEvents)[K]>): this;
    remove(): void;
}
//# sourceMappingURL=EventNode.d.ts.map