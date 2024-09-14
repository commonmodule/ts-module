class JsonUtils {
    parseWithUndefined(data) {
        return JSON.parse(data, (_, v) => v === null ? undefined : v);
    }
}
export default new JsonUtils();
//# sourceMappingURL=JsonUtils.js.map