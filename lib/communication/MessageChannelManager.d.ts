import RealtimeClient from "./RealtimeClient.js";
export default class MessageChannelManager<Handlers extends Record<string, (...args: any[]) => any>> {
    private client;
    private channelHandlers;
    private requestCounter;
    private pendingRequests;
    constructor(client: RealtimeClient);
    on<Action extends keyof Handlers>(channel: string, action: Action, handler: Handlers[Action]): this;
    off<Action extends keyof Handlers>(channel: string, action: Action, handler?: Handlers[Action]): this;
    send(channel: string, action: string, ...args: any[]): void;
    request<ResponseType>(channel: string, action: string, ...args: any[]): Promise<ResponseType>;
    private emit;
    private handleIncomingMessage;
    private processResponse;
    private processRequest;
}
//# sourceMappingURL=MessageChannelManager.d.ts.map