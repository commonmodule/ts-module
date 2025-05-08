import { DefaultEvents } from "../event/EventContainer.js";
import EventHandlers from "../event/EventHandlers.js";
import IEventContainer from "../event/IEventContainer.js";
import TreeNode from "./TreeNode.js";
export default abstract class EventTreeNode<T extends EventTreeNode<T, E>, E extends EventHandlers> extends TreeNode<T> implements IEventContainer<E> {
    private readonly eventContainer;
    on<K extends keyof (E & DefaultEvents)>(eventName: K, handler: (E & DefaultEvents)[K]): this;
    protected emit<K extends keyof (E & DefaultEvents)>(eventName: K, ...args: Parameters<(E & DefaultEvents)[K]>): this;
    remove(): void;
}
//# sourceMappingURL=EventTreeNode.d.ts.map