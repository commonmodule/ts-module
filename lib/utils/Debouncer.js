export default class Debouncer {
    delayMs;
    callback;
    timeoutId = null;
    constructor(delayMs, callback) {
        this.delayMs = delayMs;
        this.callback = callback;
        if (delayMs < 0) {
            throw new Error("Delay must be a non-negative number");
        }
    }
    execute(...args) {
        this.clearPendingExecution();
        this.timeoutId = setTimeout(() => {
            this.callback(...args);
            this.timeoutId = null;
        }, this.delayMs);
    }
    cancel() {
        this.clearPendingExecution();
    }
    isPending() {
        return this.timeoutId !== null;
    }
    clearPendingExecution() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}
//# sourceMappingURL=Debouncer.js.map