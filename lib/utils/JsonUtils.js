export default class JsonUtils {
    static parseWithUndefined(data) {
        return JSON.parse(data, (_, v) => v === null ? undefined : v);
    }
}
//# sourceMappingURL=JsonUtils.js.map