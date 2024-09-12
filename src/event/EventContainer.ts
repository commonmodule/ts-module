import Constructor from "../mixin/Constructor.js";

type EventHandler<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Return;

export type EventContainerType<ET extends Record<string, EventHandler>> = {
  on<K extends keyof ET>(eventName: K, eventHandler: ET[K]): void;
  emit<K extends keyof ET>(
    eventName: K,
    ...args: Parameters<ET[K]>
  ): ReturnType<ET[K]>[];
};

export function EventContainerMixin<CT extends Constructor>(Base: CT) {
  return class extends Base {
    #events: Record<string, EventHandler[]> = {};

    public on(eventName: string, eventHandler: EventHandler): void {
      if (!this.#events[eventName]) this.#events[eventName] = [];
      this.#events[eventName].push(eventHandler);
    }

    public emit(eventName: string, ...args: any[]): any[] {
      if (!this.#events[eventName]) return [];
      return this.#events[eventName].map((handler) => handler(...args));
    }
  };
}

export default abstract class EventContainer<
  ET extends Record<string, EventHandler>,
> extends EventContainerMixin(Object) implements EventContainerType<ET> {
  declare on: <K extends keyof ET>(eventName: K, eventHandler: ET[K]) => void;
  declare emit: <K extends keyof ET>(
    eventName: K,
    ...args: Parameters<ET[K]>
  ) => ReturnType<ET[K]>[];
}
