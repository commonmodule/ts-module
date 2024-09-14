type JsonPrimitive = string | number | boolean | null;
type JsonObject = {
    [member: string]: JsonValue;
};
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
declare class JsonUtils {
    parseWithUndefined<T extends JsonValue>(data: string): T;
}
declare const _default: JsonUtils;
export default _default;
//# sourceMappingURL=JsonUtils.d.ts.map