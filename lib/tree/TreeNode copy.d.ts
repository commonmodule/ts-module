export default abstract class TreeNode<T extends TreeNode<T>> {
    protected parent: T | undefined;
    protected children: T[];
    appendTo(parent: T, index?: number): void;
    remove(): void;
}
//# sourceMappingURL=TreeNode%20copy.d.ts.map