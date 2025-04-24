import EventContainer from "../event/EventContainer.js";
export default abstract class EventTreeNode<T extends EventTreeNode<T, E>, E extends Record<string, (...args: any[]) => any>> extends EventContainer<E> {
    protected parent: T | undefined;
    children: T[];
    protected removed: boolean;
    private subscriptions;
    appendTo(parent: T, index?: number): this;
    subscribe<E extends Record<string, (...args: any[]) => any>, K extends keyof E>(container: EventContainer<E>, eventName: K, handler: E[K]): this;
    clear(...except: (T | undefined)[]): this;
    remove(): void;
}
//# sourceMappingURL=EventTreeNode.d.ts.map