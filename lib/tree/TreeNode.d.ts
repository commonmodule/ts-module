export default abstract class TreeNode<T extends TreeNode<T>> {
    private parent;
    private children;
    appendTo(parent: T, index?: number): void;
    remove(): void;
}
//# sourceMappingURL=TreeNode.d.ts.map