class ArrayUtil {
    pull(array, ...removeList) {
        const removeSet = new Set(removeList);
        return array.filter((item) => !removeSet.has(item));
    }
}
export default new ArrayUtil();
//# sourceMappingURL=ArrayUtil.js.map