export default class ResourceLoader {
    resources = new Map();
    pendingLoads = new Map();
    refCount = new Map();
    isResourceInUse(id) {
        return this.refCount.has(id) && this.refCount.get(id) > 0;
    }
    incrementRefCount(id) {
        this.refCount.set(id, (this.refCount.get(id) || 0) + 1);
    }
    async load(id, ...args) {
        this.incrementRefCount(id);
        if (this.resources.has(id))
            return this.resources.get(id);
        if (this.pendingLoads.has(id))
            return await this.pendingLoads.get(id);
        return await this.loadResource(id, ...args);
    }
    isLoaded(id) {
        return this.resources.has(id);
    }
    release(id) {
        const refCount = this.refCount.get(id);
        if (refCount === undefined)
            throw new Error(`Resource not found: ${id}`);
        if (refCount === 1) {
            this.refCount.delete(id);
            const resource = this.resources.get(id);
            if (resource) {
                this.cleanup(resource, id);
                this.resources.delete(id);
            }
        }
        else {
            this.refCount.set(id, refCount - 1);
        }
    }
}
//# sourceMappingURL=ResourceLoader.js.map