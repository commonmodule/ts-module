export default interface IEventContainer<E> {
  on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
}
