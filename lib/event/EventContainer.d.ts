import Constructor from "../mixin/Constructor.js";
type EventHandler<Args extends any[] = any[], Return = any> = (...args: Args) => Return;
export type EventContainerType<ET extends Record<string, EventHandler>> = {
    on<K extends keyof ET>(eventName: K, eventHandler: ET[K]): void;
    emit<K extends keyof ET>(eventName: K, ...args: Parameters<ET[K]>): ReturnType<ET[K]>[];
};
export declare function EventContainerMixin<CT extends Constructor>(Base: CT): {
    new (...args: any[]): {
        "__#3604@#events": Record<string, EventHandler[]>;
        on(eventName: string, eventHandler: EventHandler): void;
        emit(eventName: string, ...args: any[]): any[];
    };
} & CT;
declare const EventContainer_base: {
    new (...args: any[]): {
        "__#3604@#events": Record<string, EventHandler[]>;
        on(eventName: string, eventHandler: EventHandler): void;
        emit(eventName: string, ...args: any[]): any[];
    };
} & ObjectConstructor;
export default abstract class EventContainer<ET extends Record<string, EventHandler>> extends EventContainer_base implements EventContainerType<ET> {
    on: <K extends keyof ET>(eventName: K, eventHandler: ET[K]) => void;
    emit: <K extends keyof ET>(eventName: K, ...args: Parameters<ET[K]>) => ReturnType<ET[K]>[];
}
export {};
//# sourceMappingURL=EventContainer.d.ts.map