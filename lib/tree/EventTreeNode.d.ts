import EventRecord from "../event/EventRecord.js";
import TreeNode from "./TreeNode.js";
export default abstract class EventTreeNode<T extends EventTreeNode<T, E>, E extends EventRecord> extends TreeNode<T> {
    private readonly events;
    private subscriptions;
    on<K extends keyof (E & {
        remove: () => void;
    })>(eventName: K, handler: (E & {
        remove: () => void;
    })[K]): this;
    off<K extends keyof (E & {
        remove: () => void;
    })>(eventName: K, handler?: (E & {
        remove: () => void;
    })[K]): this;
    protected hasEvent<K extends keyof E>(eventName: K): boolean;
    protected emit<K extends keyof (E & {
        remove: () => void;
    })>(eventName: K, ...args: Parameters<(E & {
        remove: () => void;
    })[K]>): Promise<ReturnType<(E & {
        remove: () => void;
    })[K]>[]>;
    subscribe<E2 extends (EventRecord & {
        remove: () => void;
    }), K extends keyof E2>(target: EventTreeNode<any, E2>, eventName: K, handler: E2[K]): this;
    remove(): void;
}
//# sourceMappingURL=EventTreeNode.d.ts.map