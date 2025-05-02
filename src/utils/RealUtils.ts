export default class RealUtils {
  public static random(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
  }
}
