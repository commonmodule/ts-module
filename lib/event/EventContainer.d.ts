export default abstract class EventContainer<T extends Record<string, (...args: any[]) => any>> {
    private events;
    on<K extends keyof T>(eventName: K, eventHandler: T[K]): this;
    off<K extends keyof T>(eventName: K, eventHandler: T[K]): this;
    protected hasEvent<K extends keyof T>(eventName: K): boolean;
    protected emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>): ReturnType<T[K]>[];
}
//# sourceMappingURL=EventContainer.d.ts.map