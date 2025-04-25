export default abstract class ResourceLoader<T> {
    protected resources: Map<string, T>;
    protected pendingLoads: Map<string, Promise<T | undefined>>;
    private refCount;
    protected isResourceInUse(id: string): boolean;
    protected abstract loadResource(id: string, ...args: any[]): Promise<T | undefined>;
    protected cleanup(id: string, resource: T): void;
    private incrementRefCount;
    load(id: string, ...args: any[]): Promise<T | undefined>;
    isLoaded(id: string): boolean;
    release(id: string): void;
}
//# sourceMappingURL=ResourceLoader.d.ts.map