import RealtimeClinet from "./RealtimeClient.js";
export default class ChannelManager<H extends Record<string, (...args: any[]) => any>> {
    private client;
    private handlers;
    constructor(client: RealtimeClinet);
    on<A extends keyof H>(channel: string, action: A, handler: H[A]): this;
    off<A extends keyof H>(channel: string, action: A, handler?: H[A]): this;
    send(channel: string, action: string, data?: any): void;
    private emit;
    private parseAndEmit;
}
//# sourceMappingURL=ChannelManager.d.ts.map