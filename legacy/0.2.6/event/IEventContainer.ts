import EventRecord from "./EventRecord.js";

export default interface IEventContainer<E extends EventRecord> {
  on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;
  off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this;
}
