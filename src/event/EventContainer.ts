export default abstract class EventContainer<
  E extends Record<string, (...args: any[]) => any>,
> {
  private events: { [K in keyof E]?: E[K][] } = {};

  public on<K extends keyof E>(eventName: K, eventHandler: E[K]): this {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName]!.push(eventHandler);
    return this;
  }

  public off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this {
    const events = this.events[eventName];
    if (!events) return this;
    if (!eventHandler) {
      delete this.events[eventName];
    } else {
      const index = events.indexOf(eventHandler);
      if (index !== -1) events.splice(index, 1);
      if (events.length === 0) delete this.events[eventName];
    }
    return this;
  }

  protected hasEvent<K extends keyof E>(eventName: K): boolean {
    const events = this.events[eventName];
    if (!events) return false;
    return events.length > 0;
  }

  protected emit<K extends keyof E>(
    eventName: K,
    ...args: Parameters<E[K]>
  ): ReturnType<E[K]>[] {
    const events = this.events[eventName];
    if (!events) return [];
    return events.map((handler) => handler(...args));
  }
}
