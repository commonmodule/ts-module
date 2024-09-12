import Constructor from "../mixin/Constructor.js";
export type TreeNodeType<T extends TreeNodeType<T>> = {
    parent: T | undefined;
    children: T[];
    appendTo(parent: T, index?: number): void;
    remove(): void;
};
export declare function TreeNodeMixin<CT extends Constructor>(Base: CT): {
    new (...args: any[]): {
        parent: any | undefined;
        children: any[];
        appendTo(parent: any, index?: number): void;
        remove(): void;
    };
} & CT;
declare const TreeNode_base: {
    new (...args: any[]): {
        parent: any | undefined;
        children: any[];
        appendTo(parent: any, index?: number): void;
        remove(): void;
    };
} & ObjectConstructor;
export default abstract class TreeNode<T extends TreeNode<T>> extends TreeNode_base implements TreeNodeType<T> {
    parent: T | undefined;
    children: T[];
    appendTo: (parent: T, index?: number) => void;
    remove: () => void;
}
export {};
//# sourceMappingURL=TreeNode.d.ts.map