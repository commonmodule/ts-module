import EventContainer from "../event/EventContainer.js";
export default abstract class EventTreeNode<TT extends EventTreeNode<TT, ET>, ET extends Record<string, (...args: any[]) => any>> extends EventContainer<ET> {
    protected parent: TT | undefined;
    protected children: TT[];
    appendTo(parent: TT, index?: number): void;
    remove(): void;
}
//# sourceMappingURL=EventTreeNode.d.ts.map