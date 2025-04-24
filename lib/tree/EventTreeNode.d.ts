import EventContainer from "../event/EventContainer.js";
import EventRecord from "../event/EventRecord.js";
export default abstract class EventTreeNode<T extends EventTreeNode<T, E>, E extends EventRecord> extends EventContainer<E & {
    remove: () => void;
}> {
    protected parent: T | undefined;
    children: T[];
    protected removed: boolean;
    private subscriptions;
    appendTo(parent: T, index?: number): this;
    subscribe<E extends EventRecord, K extends keyof E>(container: EventContainer<E>, eventName: K, handler: E[K]): this;
    clear(...except: (T | undefined)[]): this;
    remove(): void;
}
//# sourceMappingURL=EventTreeNode.d.ts.map