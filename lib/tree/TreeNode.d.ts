export default abstract class TreeNode<T extends TreeNode<T>> {
    protected parent: T | undefined;
    protected children: T[];
    protected _appendTo(parent: T, index?: number): void;
    protected _remove(): void;
}
//# sourceMappingURL=TreeNode.d.ts.map