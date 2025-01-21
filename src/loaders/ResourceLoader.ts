export default abstract class ResourceLoader<T> {
  protected resources: Map<string, T> = new Map();
  protected pendingLoads: Map<string, Promise<T | undefined>> = new Map();

  private refCount: Map<string, number> = new Map();

  protected isResourceInUse(id: string): boolean {
    return this.refCount.has(id) && this.refCount.get(id)! > 0;
  }

  protected abstract loadResource(
    id: string,
    ...args: any[]
  ): Promise<T | undefined>;

  protected abstract cleanup(resource: T, id: string): void;

  private incrementRefCount(id: string): void {
    this.refCount.set(id, (this.refCount.get(id) || 0) + 1);
  }

  public async load(id: string, ...args: any[]): Promise<T | undefined> {
    this.incrementRefCount(id);
    if (this.resources.has(id)) return this.resources.get(id)!;
    if (this.pendingLoads.has(id)) return await this.pendingLoads.get(id)!;
    return await this.loadResource(id, ...args);
  }

  public release(id: string): void {
    const refCount = this.refCount.get(id);
    if (refCount === undefined) throw new Error(`Resource not found: ${id}`);

    if (refCount === 1) {
      this.refCount.delete(id);
      const resource = this.resources.get(id);
      if (resource) {
        this.cleanup(resource, id);
        this.resources.delete(id);
      }
    } else {
      this.refCount.set(id, refCount - 1);
    }
  }
}
