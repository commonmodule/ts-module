import EventContainer from "../event/EventContainer.js";
export default abstract class EventTreeNode<TT extends EventTreeNode<TT, ET>, ET extends Record<string, (...args: any[]) => any>> extends EventContainer<ET> {
    protected parent: TT | undefined;
    protected children: TT[];
    protected removed: boolean;
    appendTo(parent: TT, index?: number): this;
    remove(): void;
}
//# sourceMappingURL=EventTreeNode.d.ts.map