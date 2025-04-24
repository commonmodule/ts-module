# @commonmodule/ts

A TypeScript utility module that provides various classes and helpers for
events, trees, data structures, string manipulation, object comparison, JSON
utilities, and communication management through a realtime client.

---

> **Notice on exports**
>
> Most utility classes (e.g. `StringUtils`, `ObjectUtils`) are exported as a
> **singleton instance**, not the class constructor.
>
> ```ts
> import { StringUtils } from "@commonmodule/ts";
> // StringUtils is already an instantiated object – no `new` needed.
> ```
>
> When you need the class itself (rare), import from its relative path instead.

---

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

---

## API Reference

### Communication

---

#### RealtimeClient

An **interface** representing a realtime connection or transport layer.
Implementations should provide methods for sending and receiving messages.

```ts
interface RealtimeClient {
  send(message: string): void;
  onMessage(handler: (message: string) => void): void;
}
```

**Members**:

| Member                                          | Access     | Description                                                        |
| ----------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `send(message: string)`                         | **public** | Sends a message (serialized string) over the connection.           |
| `onMessage(handler: (message: string) => void)` | **public** | Registers a callback that executes whenever a message is received. |

---

#### MessageChannelManager

A class that manages message channels, actions, and optional request–response
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

**Members**:

| Member                                                                                            | Access     | Description                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `on<Action extends keyof Handlers>(channel: string, action: Action, handler: Handlers[Action])`   | **public** | Subscribes to a specific channel/action pair.                                                                                                                      |
| `off<Action extends keyof Handlers>(channel: string, action: Action, handler?: Handlers[Action])` | **public** | Unsubscribes from a channel/action. If no `handler` is specified, removes all handlers for that action.                                                            |
| `send(channel: string, action: string, ...args: any[])`                                           | **public** | Sends a message on the specified channel with the given action and arguments.                                                                                      |
| `request<ResponseType>(channel: string, action: string, ...args: any[]): Promise<ResponseType>`   | **public** | Sends a request message (with a unique `requestId`) on the specified channel. Returns a `Promise` that resolves or rejects when the response or error is received. |

---

### Event

---

#### EventRecord

A simple type alias defining the structure of event-handler objects:

```ts
type EventRecord = Record<string, (...args: any[]) => any>;
```

Each event is identified by a string key, and each key’s value is a function
taking arbitrary arguments.

---

#### EventContainer

Manages subscriptions and emissions for a set of events described by an
`EventRecord`.

```ts
class EventContainer<E extends EventRecord = EventRecord> {
  // ...
}
```

**Members**:

| Member                                                                                          | Access        | Description                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `on<K extends keyof E>(eventName: K, eventHandler: E[K])`                                       | **public**    | Registers an event handler for the specified event name.                                                                            |
| `off<K extends keyof E>(eventName: K, eventHandler?: E[K])`                                     | **public**    | Removes a handler from an event. If no handler is passed, removes all handlers for that event.                                      |
| `emit<K extends keyof E>(eventName: K, ...args: Parameters<E[K]>): Promise<ReturnType<E[K]>[]>` | **protected** | Triggers all handlers associated with an event name (asynchronously). Returns an array of results (including any awaited promises). |
| `hasEvent<K extends keyof E>(eventName: K): boolean`                                            | **protected** | Checks whether this container has any handlers for the given event name.                                                            |
| `clearEvents()`                                                                                 | **protected** | Removes all events and handlers from this container (used internally for cleanup).                                                  |

> **Note**: The `emit()` method is **protected** by default in the code above,
> but you can change it to public if needed in your own implementation.\
> For asynchronous event results, always `await emit()` if you need the
> aggregated return values.

---

### Loaders

---

#### ResourceLoader

An **abstract** class for loading and managing reference-counted resources.

```ts
abstract class ResourceLoader<T> {
  // ...
}
```

**Key Properties**:

- `resources: Map<string, T>` – Stores loaded resources by ID.
- `pendingLoads: Map<string, Promise<T | undefined>>` – Keeps track of pending
  load operations.
- `refCount: Map<string, number>` – Reference counts per resource ID.

**Members**:

| Member                                                              | Access                     | Description                                                                                                                                            |
| ------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `load(id: string, ...args: any[]): Promise<T \| undefined>`         | **public**                 | Increments the reference count for the resource. If already loaded or loading, returns the existing resource/promise; otherwise, calls `loadResource`. |
| `isLoaded(id: string): boolean`                                     | **public**                 | Checks if a resource is currently loaded (i.e., exists in `resources` map).                                                                            |
| `release(id: string): void`                                         | **public**                 | Decrements the resource’s reference count. If it drops to 0, calls `cleanup(resource, id)` and removes the resource from `resources`.                  |
| `isResourceInUse(id: string): boolean`                              | **protected**              | Checks if a resource is still in use (i.e., reference count > 0).                                                                                      |
| `loadResource(id: string, ...args: any[]): Promise<T \| undefined>` | **protected** **abstract** | Subclasses must implement the actual resource loading logic.                                                                                           |
| `cleanup(resource: T, id: string): void`                            | **protected** **abstract** | Subclasses must define how to clean up the resource (e.g. disposing of memory, closing connections) after the reference count drops to 0.              |

---

### Tree

---

#### TreeNode

An **abstract** class that represents a tree node structure with a parent-child
relationship.

```ts
abstract class TreeNode<T extends TreeNode<T>> {
  // ...
}
```

**Key Properties**:

- `parent: T | undefined` – The parent node.
- `children: T[]` – List of child nodes.
- `removed: boolean` – If `true`, the node has been removed from its parent.

**Members**:

| Member                                       | Access     | Description                                                                                                                                   |
| -------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `appendTo(parent: T, index?: number): this`  | **public** | Appends the current node to a new parent node. If `index` is specified, the node is inserted at that position within the parent's `children`. |
| `clear(...except: (T \| undefined)[]): this` | **public** | Removes all children except for the specified ones.                                                                                           |
| `remove(): void`                             | **public** | Removes the current node from its parent and clears all of its children.                                                                      |

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

**Members**:

| Member                                                                                                                                           | Access     | Description                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `on<K extends keyof (E & { remove: () => void })>(eventName: K, handler: (E & { remove: () => void })[K])`                                       | **public** | Registers an event handler for the given event name.                                                                                                       |
| `off<K extends keyof (E & { remove: () => void })>(eventName: K, handler?: (E & { remove: () => void })[K])`                                     | **public** | Unregisters an event handler for the given event name.                                                                                                     |
| `subscribe<E2 extends (EventRecord & { remove: () => void }), K extends keyof E2>(target: EventTreeNode<any, E2>, eventName: K, handler: E2[K])` | **public** | Subscribes to events from another `EventTreeNode`. Automatically unsubscribes if that target node is removed.                                              |
| `remove(): void`                                                                                                                                 | **public** | Removes this node, emits a `remove` event, clears its event handlers, and unsubscribes from any other nodes. Always call `super.remove()` if you override. |

---

### Utils

---

#### StringUtils

Utility class (exported as a singleton instance) for common string
manipulations.

**Members**:

| Member                                                             | Access     | Description                                                                                                                                                            |
| ------------------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capitalize(input: string): string`                                | **public** | Capitalizes the first letter of each word in a given string, making all other letters lowercase.                                                                       |
| `isKebabCase(str: string): boolean`                                | **public** | Checks if a given string is in kebab-case (lowercase words separated by hyphens).                                                                                      |
| `formatNumberWithCommas(value: string, decimals?: number): string` | **public** | Inserts commas as thousands separators in a numeric string. If `decimals` is provided (and the number is within safe integer range), it formats to that many decimals. |

---

#### ObjectUtils

Utility class (exported as a singleton instance) for object comparisons.

**Members**:

| Member                                   | Access     | Description                                                        |
| ---------------------------------------- | ---------- | ------------------------------------------------------------------ |
| `isEqual(obj1: any, obj2: any): boolean` | **public** | Performs a deep comparison to check if two objects are equivalent. |

---

#### JsonUtils

Utilities for JSON parsing and handling edge cases like `null` → `undefined`.

**Members**:

| Member                                   | Access     | Description                                                |
| ---------------------------------------- | ---------- | ---------------------------------------------------------- |
| `parseWithUndefined<T>(data: string): T` | **public** | Parses JSON data, converting `null` values to `undefined`. |

---

#### Debouncer

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

**Members**:

| Member                          | Access     | Description                                                                                                          |
| ------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| `execute(...args: any[]): void` | **public** | Schedules the callback to run after the specified delay. If called again before the delay expires, the timer resets. |
| `cancel(): void`                | **public** | Cancels any pending debounced callback.                                                                              |
| `isPending(): boolean`          | **public** | Returns `true` if there is a pending execution that hasn’t yet fired.                                                |

---

#### IntegerUtils

Provides utility methods for integer-related operations (exported as a singleton
instance).

**Members**:

| Member                             | Access     | Description                                                     |
| ---------------------------------- | ---------- | --------------------------------------------------------------- |
| `random(min: number, max: number)` | **public** | Generates a random integer between `min` and `max` (inclusive). |

---

#### ArrayUtils

Provides utility methods for array manipulation (exported as a singleton
instance).

**Members**:

| Member                                          | Access     | Description                                                                        |
| ----------------------------------------------- | ---------- | ---------------------------------------------------------------------------------- |
| `pull<T>(array: T[], ...removeList: T[]): void` | **public** | Removes the specified elements (`removeList`) from the given array, if they exist. |

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
debouncedSave.execute({ id: 2 }); // Only this call will run after 500ms
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
