type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [member: string]: JsonValue };
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

class JsonUtils {
  public parseWithUndefined<T>(data: string): T {
    return JSON.parse(data, (_, v) => v === null ? undefined : v) as T;
  }
}

export default new JsonUtils();
