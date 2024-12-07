import RealtimeClinet from "./RealtimeClient.js";

interface Message {
  channel: string;
  action: string;
  args: any[];
  requestId?: string;
}

const RESPONSE_CHANNEL = "__response";
const RESPONSE_ACTION = "return";
const ERROR_ACTION = "error";

export default class ChannelManager<
  H extends Record<string, (...args: any[]) => any>,
> {
  private handlers: { [channel: string]: { [A in keyof H]?: H[A][] } } = {};
  private requestCounter: number = 0;
  private pendingResponses: Map<string, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = new Map();

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

  public request<R>(
    channel: string,
    action: string,
    ...args: any[]
  ): Promise<R> {
    const requestId = `req_${++this.requestCounter}`;
    const message: Message = { channel, action, args, requestId };

    return new Promise((resolve, reject) => {
      this.pendingResponses.set(requestId, { resolve, reject });
      this.client.send(JSON.stringify(message));
    });
  }

  private emit<A extends keyof H>(message: Message): ReturnType<H[A]>[] {
    const { channel, action, args } = message;

    const channelHandlers = this.handlers[channel];
    const actionHandlers = channelHandlers?.[action as A];

    if (!actionHandlers) return [];
    return actionHandlers.map((handler) => handler(...args));
  }

  private async parseAndEmit(rawMessage: string) {
    try {
      const message: Message = JSON.parse(rawMessage);
      if (message.channel && message.action) {
        if (message.channel === RESPONSE_CHANNEL) {
          if (message.requestId) {
            if (message.action === RESPONSE_ACTION) {
              const response = this.pendingResponses.get(message.requestId);
              if (response) {
                response.resolve(message.args[0]);
                this.pendingResponses.delete(message.requestId!);
              }
            } else if (message.action === ERROR_ACTION) {
              const response = this.pendingResponses.get(message.requestId);
              if (response) {
                response.reject(message.args[0]);
                this.pendingResponses.delete(message.requestId!);
              }
            }
          }
        } else {
          const results = this.emit(message);
          if (message.requestId && results.length > 0) {
            const result = results[0];
            const responseMessage: Message = {
              channel: RESPONSE_CHANNEL,
              action: RESPONSE_ACTION,
              args: (result as any) instanceof Promise
                ? [await result]
                : [result],
              requestId: message.requestId,
            };
            this.client.send(JSON.stringify(responseMessage));
          }
        }
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
