import RealtimeClinet from "./RealtimeClient.js";
export default class ChannelManager<Handlers extends Record<string, (...args: any[]) => any>> {
    private client;
    private handlers;
    private requestCounter;
    private pendingRequests;
    constructor(client: RealtimeClinet);
    on<Action extends keyof Handlers>(channel: string, action: Action, handler: Handlers[Action]): this;
    off<Action extends keyof Handlers>(channel: string, action: Action, handler?: Handlers[Action]): this;
    send(channel: string, action: string, ...args: any[]): void;
    request<ResponseType>(channel: string, action: string, ...args: any[]): Promise<ResponseType>;
    private emit;
    private handleIncomingMessage;
    private processResponse;
    private processRequest;
}
//# sourceMappingURL=ChannelManager.d.ts.map