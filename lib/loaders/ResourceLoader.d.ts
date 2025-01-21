export default abstract class ResourceLoader<T> {
    protected resources: Map<string, T>;
    protected pendingLoads: Map<string, Promise<T | undefined>>;
    private refCount;
    protected isResourceInUse(id: string): boolean;
    protected abstract loadResource(id: string, ...args: any[]): Promise<T | undefined>;
    protected abstract cleanup(resource: T, id: string): void;
    private incrementRefCount;
    load(id: string, ...args: any[]): Promise<T | undefined>;
    release(id: string): void;
}
//# sourceMappingURL=ResourceLoader.d.ts.map