export default class Debouncer {
    private readonly delayMs;
    private readonly callback;
    private timeoutId;
    constructor(delayMs: number, callback: (...args: any[]) => void);
    execute(...args: any[]): void;
    cancel(): void;
    isPending(): boolean;
    private clearPendingExecution;
}
//# sourceMappingURL=Debouncer.d.ts.map