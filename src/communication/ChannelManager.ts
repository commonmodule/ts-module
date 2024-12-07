import RealtimeClinet from "./RealtimeClient.js";

interface Message {
  channel: string;
  action: string;
  args: any[];
}

export default class ChannelManager<
  H extends Record<string, (...args: any[]) => any>,
> {
  private handlers: { [channel: string]: { [A in keyof H]?: H[A][] } } = {};

  constructor(private client: RealtimeClinet) {
    client.onMessage((rawMessage) => this.parseAndEmit(rawMessage));
  }

  public on<A extends keyof H>(
    channel: string,
    action: A,
    handler: H[A],
  ): this {
    if (!this.handlers[channel]) this.handlers[channel] = {};
    const channelHandlers = this.handlers[channel]!;
    if (!channelHandlers[action]) channelHandlers[action] = [];
    channelHandlers[action]!.push(handler);
    return this;
  }

  public off<A extends keyof H>(
    channel: string,
    action: A,
    handler?: H[A],
  ): this {
    const channelHandlers = this.handlers[channel];
    if (!channelHandlers) return this;

    const actionHandlers = channelHandlers[action];
    if (!actionHandlers) return this;

    if (!handler) {
      delete channelHandlers[action];
    } else {
      const index = actionHandlers.indexOf(handler);
      if (index !== -1) actionHandlers.splice(index, 1);
      if (actionHandlers.length === 0) delete channelHandlers[action];
    }

    if (Object.keys(channelHandlers).length === 0) {
      delete this.handlers[channel];
    }

    return this;
  }

  public send(channel: string, action: string, ...args: any[]): void {
    const message: Message = { channel, action, args };
    this.client.send(JSON.stringify(message));
  }

  private emit<A extends keyof H>(message: Message): void {
    const { channel, action, args } = message;

    const channelHandlers = this.handlers[channel];
    const actionHandlers = channelHandlers?.[action as A];

    if (actionHandlers) {
      actionHandlers.forEach((handler) => handler(...args));
    } else {
      console.warn(
        `No handler found for channel: ${channel}, action: ${action}`,
      );
    }
  }

  private parseAndEmit(rawMessage: string): void {
    try {
      const message: Message = JSON.parse(rawMessage);
      if (message.channel && message.action) {
        this.emit(message);
      } else {
        console.warn(
          "Invalid message format: Missing channel or action",
          rawMessage,
        );
      }
    } catch (error) {
      console.error("Failed to parse message:", rawMessage, error);
    }
  }
}
