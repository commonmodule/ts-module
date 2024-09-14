class ArrayUtils {
    pull(array, ...removeList) {
        const removeSet = new Set(removeList);
        return array.filter((item) => !removeSet.has(item));
    }
}
export default new ArrayUtils();
//# sourceMappingURL=ArrayUtils.js.map