export default class ArrayUtils {
  public static pull<T>(array: T[], ...removeList: T[]): void {
    for (const remove of removeList) {
      const index = array.indexOf(remove);
      if (index !== -1) array.splice(index, 1);
    }
  }
}
