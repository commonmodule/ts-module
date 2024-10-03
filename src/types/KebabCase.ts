type KebabCase<T extends string> = T extends Lowercase<T>
  ? T extends `${infer First}-${infer Rest}` ? (
      First extends KebabCase<First> ? (
          Rest extends KebabCase<Rest> ? T
            : never
        )
        : never
    )
  : T
  : never;

export default KebabCase;
