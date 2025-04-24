export default abstract class TreeNode<T extends TreeNode<T>> {
    protected parent: T | undefined;
    children: T[];
    protected removed: boolean;
    appendTo(parent: T, index?: number): this;
    clear(...except: (T | undefined)[]): this;
    remove(): void;
}
//# sourceMappingURL=TreeNode.d.ts.map