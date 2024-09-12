export function EventContainerMixin(Base) {
    return class extends Base {
        #events = {};
        on(eventName, eventHandler) {
            if (!this.#events[eventName])
                this.#events[eventName] = [];
            this.#events[eventName].push(eventHandler);
        }
        emit(eventName, ...args) {
            if (!this.#events[eventName])
                return [];
            return this.#events[eventName].map((handler) => handler(...args));
        }
    };
}
export default class EventContainer extends EventContainerMixin(Object) {
}
//# sourceMappingURL=EventContainer.js.map