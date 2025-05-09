export type EventHandler = (...args: any[]) => any;

type EventHandlers = Record<string, EventHandler>;

export default EventHandlers;
