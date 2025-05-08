export default abstract class TreeNode<T extends TreeNode<T>> {
    protected parent: T | undefined;
    children: T[];
    appendTo(parent: T, index?: number): this;
    clear(...except: (T | undefined)[]): this;
    remove(): void;
    private isRemoved;
}
//# sourceMappingURL=TreeNode%20copy.d.ts.map