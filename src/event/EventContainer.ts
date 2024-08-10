export default abstract class EventContainer<
  ET extends Record<string, (...args: any[]) => any>,
> {
  private events: { [K in keyof ET]?: ET[K][] } = {};

  public on<K extends keyof ET>(eventName: K, eventHandler: ET[K]): void {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName]!.push(eventHandler);
  }

  public emit<K extends keyof ET>(
    eventName: K,
    ...args: Parameters<ET[K]>
  ): ReturnType<ET[K]>[] {
    if (!this.events[eventName]) return [];
    return this.events[eventName]!.map((handler) => handler(...args));
  }
}
