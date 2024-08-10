export default abstract class EventContainer<ET extends Record<string, (...args: any[]) => any>> {
    private events;
    on<K extends keyof ET>(eventName: K, eventHandler: ET[K]): void;
    emit<K extends keyof ET>(eventName: K, ...args: Parameters<ET[K]>): ReturnType<ET[K]>[];
}
//# sourceMappingURL=EventContainer.d.ts.map