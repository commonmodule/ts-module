class ArrayUtils {
  public pull<T>(array: T[], ...removeList: T[]): T[] {
    const removeSet = new Set(removeList);
    return array.filter((item) => !removeSet.has(item));
  }
}

export default new ArrayUtils();
