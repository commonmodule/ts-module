# @commonmodule/ts

A TypeScript utility module that provides various classes and helpers for
events, trees, data structures, string manipulation, object comparison, JSON
utilities, and communication management through a realtime client.

## Table of Contents

1. [Installation](#installation)
2. [API Reference](#api-reference)
   - [Communication](#communication)
     - [RealtimeClient](#realtimeclient)
     - [MessageChannelManager](#messagechannelmanager)
   - [Event](#event)
     - [EventRecord](#eventrecord)
     - [EventContainer](#eventcontainer)
   - [Loaders](#loaders)
     - [ResourceLoader](#resourceloader)
   - [Tree](#tree)
     - [TreeNode](#treenode)
     - [EventTreeNode](#eventtreenode)
   - [Utils](#utils)
     - [StringUtils](#stringutils)
     - [ObjectUtils](#objectutils)
     - [JsonUtils](#jsonutils)
     - [Debouncer](#debouncer)
     - [IntegerUtils](#integerutils)
     - [ArrayUtils](#arrayutils)
3. [Usage Examples](#usage-examples)
4. [Contributing](#contributing)
5. [License](#license)

---

## Installation

```bash
npm install @commonmodule/ts
# or
yarn add @commonmodule/ts
```

## API Reference

### Communication

#### RealtimeClient (Interface)

An interface representing a realtime connection or transport layer.
Implementations should provide methods for sending and receiving messages.

```ts
interface RealtimeClient {
  send(message: string): void;
  onMessage(handler: (message: string) => void): void;
}
```

**Methods**:

1. **`send(message: string): void`**\
   Sends a message (serialized string) over the connection.
2. **`onMessage(handler: (message: string) => void): void`**\
   Registers a callback that executes whenever a message is received.

---

#### MessageChannelManager

A class that manages message channels, actions, and optional request-response
flows via a `RealtimeClient`.

```ts
class MessageChannelManager<
  Handlers extends Record<string, (...args: any[]) => any>,
> {
  constructor(client: RealtimeClient) {/* ... */}
  // ...
}
```

**Constructor**:

- `client: RealtimeClient` – The realtime client instance used for
  communication.

**Methods**:

1. **`on<Action extends keyof Handlers>(channel: string, action: Action, handler: Handlers[Action]): this`**\
   Subscribes to a specific channel/action pair.

2. **`off<Action extends keyof Handlers>(channel: string, action: Action, handler?: Handlers[Action]): this`**\
   Unsubscribes from a channel/action. If no `handler` is specified, removes all
   handlers for that action.

3. **`send(channel: string, action: string, ...args: any[]): void`**\
   Sends a message on the specified channel with the given action and arguments.

4. **`request<ResponseType>(channel: string, action: string, ...args: any[]): Promise<ResponseType>`**\
   Sends a request message (with a unique `requestId`) on the specified channel.
   Returns a `Promise` that resolves or rejects when the response or error is
   received.

---

### Event

#### EventRecord

A simple type alias defining the structure of event-handler objects:

```ts
type EventRecord = Record<string, (...args: any[]) => any>;
```

This implies each event is identified by a string key, and each key’s value is a
function taking arbitrary arguments.

---

#### EventContainer

Manages subscriptions and emissions for a set of events described by an
`EventRecord`.

```ts
class EventContainer<E extends EventRecord = EventRecord> {
  // ...
}
```

**Methods**:

1. **`on<K extends keyof E>(eventName: K, eventHandler: E[K]): this`**\
   Registers an event handler for the specified event name.
2. **`off<K extends keyof E>(eventName: K, eventHandler?: E[K]): this`**\
   Removes a handler from an event. If no handler is passed, removes all
   handlers for that event.
3. **`emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>`**\
   Triggers all handlers associated with an event name. Returns an array of
   return values (or resolves any Promises).
4. **`clearEvents(): void`**\
   Removes all events and handlers from this container.

---

### Loaders

#### ResourceLoader

An abstract class for loading and managing reference-counted resources.

```ts
abstract class ResourceLoader<T> {
  // ...
}
```

**Properties**:

- `resources: Map<string, T>` – Stores loaded resources by ID.
- `pendingLoads: Map<string, Promise<T | undefined>>` – Keeps track of pending
  load operations.
- `refCount: Map<string, number>` – Reference counts per resource ID.

**Methods**:

1. **`load(id: string, ...args: any[]): Promise<T | undefined>`**
   - Increments the reference count for the resource.
   - If already loaded or loading, returns the existing resource or promise.
   - Otherwise, calls `loadResource`.

2. **`isLoaded(id: string): boolean`**\
   Checks if a resource is currently loaded.

3. **`release(id: string): void`**\
   Decrements the resource’s reference count. If it drops to 0, calls `cleanup`
   and removes the resource.

4. **`loadResource(id: string, ...args: any[]): Promise<T | undefined>`**
   _(abstract)_\
   Subclasses must implement the actual resource loading logic.

5. **`cleanup(resource: T, id: string): void`** _(abstract)_\
   Subclasses must define how to clean up the resource (e.g., disposing of
   memory, closing connections).

---

### Tree

#### TreeNode

An abstract class that represents a tree node structure with a parent-child
relationship.

```ts
abstract class TreeNode<T extends TreeNode<T>> {
  // ...
}
```

**Properties**:

- `parent: T | undefined` – The parent node.
- `children: T[]` – List of child nodes.
- `removed: boolean` – If `true`, the node has been removed from its parent.

**Methods**:

1. **`appendTo(parent: T, index?: number): this`**\
   Appends the current node to a new parent node. If `index` is specified, the
   node is inserted at that position.
2. **`clear(...except: (T | undefined)[]): this`**\
   Removes all children except for the specified ones.
3. **`remove(): void`**\
   Removes the current node from its parent and clears all its children.

---

#### EventTreeNode

Extends `TreeNode` to add event handling via an internal event container.
Particularly useful for hierarchical data structures that emit or listen to
events.

```ts
abstract class EventTreeNode<
  T extends EventTreeNode<T, E>,
  E extends EventRecord,
> extends TreeNode<T> {
  // ...
}
```

**Key Differences from `TreeNode`**:

- Has an internal `EventContainer` to handle its own events.
- Supports event subscription, emission, and cleanup on removal.

**Methods**:

1. **`on<K extends keyof (E & { remove: () => void })>`**\
   Registers an event handler for the given event name.
2. **`off<K extends keyof (E & { remove: () => void })>`**\
   Unregisters an event handler for the given event name.
3. **`subscribe<E2 extends (EventRecord & { remove: () => void }), K extends keyof E2>`**\
   Subscribes to events from another `EventTreeNode`.
4. **`remove()`**\
   Removes this node, clears its events, and unsubscribes from any subscriptions
   to other nodes.

---

### Utils

#### StringUtils

Utility class for common string manipulations.

**Methods**:

1. **`capitalize(input: string): string`**\
   Capitalizes the first letter of each word in a given string. All other
   letters become lowercase.
   ```ts
   const result = StringUtils.capitalize("hello world");
   // Result: "Hello World"
   ```

2. **`isKebabCase(str: string): boolean`**\
   Checks if a given string is in kebab-case (lowercase words separated by
   hyphens).
   ```ts
   StringUtils.isKebabCase("hello-world"); // true
   StringUtils.isKebabCase("HelloWorld"); // false
   ```

3. **`formatNumberWithCommas(value: string, decimals?: number): string`**\
   Formats a numeric string by inserting commas as thousands separators. If
   `decimals` is provided, it will format the number to that many decimal
   places, unless the number exceeds `Number.MAX_SAFE_INTEGER`.
   ```ts
   // Examples
   StringUtils.formatNumberWithCommas("1234567.89"); // "1,234,567.89"
   StringUtils.formatNumberWithCommas("1234567.89", 2); // "1,234,567.89"
   ```

---

#### ObjectUtils

Utility class for object comparisons.

**Methods**:

1. **`isEqual(obj1: any, obj2: any): boolean`**\
   Performs a deep comparison to check if two objects are equivalent.
   ```ts
   ObjectUtils.isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
   ObjectUtils.isEqual({ a: 1 }, { a: 1, b: 2 }); // false
   ```

---

#### JsonUtils

Utilities for JSON parsing and handling edge cases like `null` to `undefined`.

**Methods**:

1. **`parseWithUndefined<T>(data: string): T`**\
   Parses JSON data, converting `null` values to `undefined`.
   ```ts
   const json = `{"name": null, "age": 25}`;
   const result = JsonUtils.parseWithUndefined<{ name?: string; age: number }>(
     json,
   );
   // result => { name: undefined, age: 25 }
   ```

---

### Debouncer

A class to debounce function execution. Useful for events that should only fire
after a certain time has elapsed without re-triggering.

```ts
class Debouncer {
  constructor(delayMs: number, callback: (...args: any[]) => void) {/* ... */}
  // ...
}
```

**Constructor**:

- `delayMs: number` – The time in milliseconds to wait before calling the
  callback. Must be >= 0.
- `callback: (...args: any[]) => void` – The function to call after the delay.

**Methods**:

1. **`execute(...args: any[]): void`**\
   Calls the debouncer’s callback function after the specified delay. If
   `execute` is called again before the delay ends, the timer is reset.
2. **`cancel(): void`**\
   Cancels any pending callback execution.
3. **`isPending(): boolean`**\
   Returns whether there is a pending, not-yet-executed callback.

---

#### IntegerUtils

Provides utility methods for integer-related operations.

**Methods**:

1. **`random(min: number, max: number): number`**\
   Generates a random integer between `min` and `max` (inclusive).

---

### ArrayUtils

Provides utility methods for array manipulation.

**Methods**:

1. **`pull<T>(array: T[], ...removeList: T[]): void`**\
   Removes the specified elements from the given array, if they exist.
   ```ts
   const arr = [1, 2, 3, 4];
   ArrayUtils.pull(arr, 2, 4);
   // arr => [1, 3]
   ```

---

## Usage Examples

Below are some short usage examples illustrating how to use the provided classes
and functions.

### StringUtils Example

```ts
import { StringUtils } from "@commonmodule/ts";

const text = "hello world from TS";
const capitalized = StringUtils.capitalize(text);
console.log(capitalized);
// Output: "Hello World From Ts"

console.log(StringUtils.isKebabCase("kebab-case-example")); // true
```

### ObjectUtils Example

```ts
import { ObjectUtils } from "@commonmodule/ts";

const objA = { name: "Alice", details: { age: 30 } };
const objB = { name: "Alice", details: { age: 30 } };
console.log(ObjectUtils.isEqual(objA, objB)); // true
```

### Debouncer Example

```ts
import { Debouncer } from "@commonmodule/ts";

function saveToServer(data: any) {
  console.log("Saving data to server:", data);
}

const debouncedSave = new Debouncer(500, saveToServer);

debouncedSave.execute({ id: 1 });
// If "execute" is called again within 500ms, the old call is canceled
debouncedSave.execute({ id: 2 }); // Will replace the previous call
```

### EventContainer Example

```ts
import { EventContainer } from "@commonmodule/ts";

class MyEventContainer extends EventContainer<{
  dataReceived: (data: any) => void;
}> {
  constructor() {
    super();

    this.on("dataReceived", (data) => {
      console.log("Data received:", data);
    });

    // Emit an event
    this.emit("dataReceived", { message: "Hello" });
    // => "Data received: { message: 'Hello' }"
  }
}
```

### MessageChannelManager Example

```ts
import { MessageChannelManager, RealtimeClient } from "@commonmodule/ts";

class WebSocketClient implements RealtimeClient {
  private socket: WebSocket;
  private messageHandler?: (message: string) => void;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      if (this.messageHandler) {
        this.messageHandler(event.data);
      }
    };
  }

  send(message: string): void {
    this.socket.send(message);
  }

  onMessage(handler: (message: string) => void): void {
    this.messageHandler = handler;
  }
}

const client = new WebSocketClient("ws://example.com");
const manager = new MessageChannelManager<{
  greet: (name: string) => void;
}>(client);

// Listen for 'greet' actions on channel "chat"
manager.on("chat", "greet", (name) => {
  console.log("Hello,", name);
});

// Send a message
manager.send("chat", "greet", "Alice");
// => Console: "Hello, Alice"

// Request/Response pattern
(async () => {
  try {
    const response = await manager.request<string>("chat", "getWelcomeMessage");
    console.log("Received welcome message:", response);
  } catch (error) {
    console.error("Failed to get welcome message:", error);
  }
})();
```

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-feature`.
3. Make your changes and commit: `git commit -m 'Add my feature'`.
4. Push the changes: `git push origin feature/my-feature`.
5. Create a pull request.

---

## License

This module is provided under the **MIT License**. For more details, please see
the [LICENSE](./LICENSE) file in the repository.

---

**Author**: [yj.gaia](https://github.com/yjgaia)
