export default class ArrayUtils {
    static pull(array, ...removeList) {
        for (const remove of removeList) {
            const index = array.indexOf(remove);
            if (index !== -1)
                array.splice(index, 1);
        }
    }
}
//# sourceMappingURL=ArrayUtils.js.map