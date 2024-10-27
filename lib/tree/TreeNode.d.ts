export default abstract class TreeNode<T extends TreeNode<T>> {
    protected parent: T | undefined;
    protected children: T[];
    protected removed: boolean;
    appendTo(parent: T, index?: number): this;
    empty(): this;
    remove(): void;
}
//# sourceMappingURL=TreeNode.d.ts.map