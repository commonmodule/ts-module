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
  Handlers extends Record<string, (...args: any[]) => any>,
> {
  private handlers: {
    [channel: string]: { [Action in keyof Handlers]?: Handlers[Action][] };
  } = {};
  private requestCounter: number = 0;
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = new Map();

  constructor(private client: RealtimeClinet) {
    client.onMessage((rawMessage) => this.handleIncomingMessage(rawMessage));
  }

  public on<Action extends keyof Handlers>(
    channel: string,
    action: Action,
    handler: Handlers[Action],
  ): this {
    if (!this.handlers[channel]) this.handlers[channel] = {};
    const channelHandlers = this.handlers[channel]!;
    if (!channelHandlers[action]) channelHandlers[action] = [];
    channelHandlers[action]!.push(handler);
    return this;
  }

  public off<Action extends keyof Handlers>(
    channel: string,
    action: Action,
    handler?: Handlers[Action],
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

  public request<ResponseType>(
    channel: string,
    action: string,
    ...args: any[]
  ): Promise<ResponseType> {
    const requestId = `req_${++this.requestCounter}`;
    const message: Message = { channel, action, args, requestId };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
      this.client.send(JSON.stringify(message));
    });
  }

  private emit<Action extends keyof Handlers>(
    message: Message,
  ): ReturnType<Handlers[Action]>[] {
    const { channel, action, args } = message;

    const channelHandlers = this.handlers[channel];
    const actionHandlers = channelHandlers?.[action as Action];

    if (!actionHandlers) return [];
    return actionHandlers.map((handler) => handler(...args));
  }

  private async handleIncomingMessage(rawMessage: string) {
    try {
      const message: Message = JSON.parse(rawMessage);

      if (!message.channel || !message.action) {
        console.warn(
          "Invalid message format: Missing channel or action",
          rawMessage,
        );
        return;
      }

      if (message.channel === RESPONSE_CHANNEL) {
        this.processResponse(message);
      } else {
        await this.processRequest(message);
      }
    } catch (error) {
      console.error("Failed to parse message:", rawMessage, error);
    }
  }

  private processResponse(message: Message): void {
    const { requestId, action, args } = message;
    if (!requestId) return;

    const pendingRequest = this.pendingRequests.get(requestId);
    if (!pendingRequest) return;

    if (action === RESPONSE_ACTION) {
      pendingRequest.resolve(args[0]);
    } else if (action === ERROR_ACTION) {
      pendingRequest.reject(args[0]);
    }

    this.pendingRequests.delete(requestId);
  }

  private async processRequest(message: Message): Promise<void> {
    const { requestId } = message;

    const results = this.emit(message);
    if (requestId && results.length > 0) {
      const result = results[0];
      const responseMessage: Message = {
        channel: RESPONSE_CHANNEL,
        action: RESPONSE_ACTION,
        args: (result as any) instanceof Promise ? [await result] : [result],
        requestId,
      };
      this.client.send(JSON.stringify(responseMessage));
    }
  }
}
