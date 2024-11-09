export default class Debouncer {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly delayMs: number,
    private readonly callback: (...args: any[]) => void,
  ) {
    if (delayMs < 0) {
      throw new Error("Delay must be a non-negative number");
    }
  }
  public execute(...args: any[]): void {
    this.clearPendingExecution();
    this.timeoutId = setTimeout(() => {
      this.callback(...args);
      this.timeoutId = null;
    }, this.delayMs);
  }

  public cancel(): void {
    this.clearPendingExecution();
  }

  public isPending(): boolean {
    return this.timeoutId !== null;
  }

  private clearPendingExecution(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
