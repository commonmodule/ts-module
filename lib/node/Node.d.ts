export default abstract class Node<T extends Node<T>> {
    protected parent: T | undefined;
    children: T[];
    isRemoved(): boolean;
    appendTo(parent: T, index?: number): this;
    clear(...except: (T | undefined)[]): this;
    remove(): void;
}
//# sourceMappingURL=Node.d.ts.map