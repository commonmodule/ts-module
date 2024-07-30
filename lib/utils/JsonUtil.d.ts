type JsonPrimitive = string | number | boolean | null;
type JsonObject = {
    [member: string]: JsonValue;
};
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
declare class JsonUtil {
    parseWithUndefined<T extends JsonValue>(data: string): T;
}
declare const _default: JsonUtil;
export default _default;
//# sourceMappingURL=JsonUtil.d.ts.map