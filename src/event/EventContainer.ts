export default abstract class EventContainer<
  T extends Record<string, (...args: any[]) => any>,
> {
  private events: { [K in keyof T]?: T[K][] } = {};

  public on<K extends keyof T>(eventName: K, eventHandler: T[K]): this {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName]!.push(eventHandler);
    return this;
  }

  public emit<K extends keyof T>(
    eventName: K,
    ...args: Parameters<T[K]>
  ): ReturnType<T[K]>[] {
    if (!this.events[eventName]) return [];
    return this.events[eventName]!.map((handler) => handler(...args));
  }
}
