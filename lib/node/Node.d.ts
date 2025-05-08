export default abstract class Node<T extends Node<T>> {
    protected parent: T | undefined;
    protected children: T[];
    protected isRemoved(): boolean;
    appendTo(parent: T, index?: number): this;
    protected clear(...except: (T | undefined)[]): this;
    remove(): void;
}
//# sourceMappingURL=Node.d.ts.map