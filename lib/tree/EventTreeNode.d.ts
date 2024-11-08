import EventContainer from "../event/EventContainer.js";
export default abstract class EventTreeNode<TT extends EventTreeNode<TT, ET>, ET extends Record<string, (...args: any[]) => any>> extends EventContainer<ET> {
    protected parent: TT | undefined;
    children: TT[];
    protected removed: boolean;
    private subscriptions;
    appendTo(parent: TT, index?: number): this;
    subscribe<T extends Record<string, (...args: any[]) => any>, K extends keyof T>(container: EventContainer<T>, eventName: K, handler: T[K]): this;
    private unsubscribeFromAll;
    clear(...except: (TT | undefined)[]): this;
    remove(): void;
}
//# sourceMappingURL=EventTreeNode.d.ts.map