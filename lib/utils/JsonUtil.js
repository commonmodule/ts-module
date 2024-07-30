class JsonUtil {
    parseWithUndefined(data) {
        return JSON.parse(data, (_, v) => v === null ? undefined : v);
    }
}
export default new JsonUtil();
//# sourceMappingURL=JsonUtil.js.map