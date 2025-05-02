type JsonPrimitive = string | number | boolean | null;
type JsonObject = {
    [member: string]: JsonValue;
};
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export default class JsonUtils {
    static parseWithUndefined<T>(data: string): T;
}
export {};
//# sourceMappingURL=JsonUtils.d.ts.map