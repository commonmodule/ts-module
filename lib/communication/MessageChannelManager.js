const RESPONSE_CHANNEL = "__response";
const RESPONSE_ACTION = "return";
const ERROR_ACTION = "error";
export default class MessageChannelManager {
    client;
    channelHandlers = {};
    requestCounter = 0;
    pendingRequests = new Map();
    constructor(client) {
        this.client = client;
        client.onMessage((rawMessage) => this.handleIncomingMessage(rawMessage));
    }
    on(channel, action, handler) {
        if (!this.channelHandlers[channel]) {
            this.channelHandlers[channel] = {};
        }
        const actionHandlers = this.channelHandlers[channel];
        if (!actionHandlers[action])
            actionHandlers[action] = [];
        actionHandlers[action].push(handler);
        return this;
    }
    off(channel, action, handler) {
        const channelActions = this.channelHandlers[channel];
        if (!channelActions)
            return this;
        const actionHandlers = channelActions[action];
        if (!actionHandlers)
            return this;
        if (!handler) {
            delete channelActions[action];
        }
        else {
            const index = actionHandlers.indexOf(handler);
            if (index !== -1) {
                actionHandlers.splice(index, 1);
            }
            if (actionHandlers.length === 0) {
                delete channelActions[action];
            }
        }
        if (Object.keys(channelActions).length === 0) {
            delete this.channelHandlers[channel];
        }
        return this;
    }
    send(channel, action, ...args) {
        const message = { channel, action, args };
        this.client.send(JSON.stringify(message));
    }
    request(channel, action, ...args) {
        const requestId = `req_${++this.requestCounter}`;
        const message = { channel, action, args, requestId };
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(requestId, { resolve, reject });
            this.client.send(JSON.stringify(message));
        });
    }
    emit(message) {
        const { channel, action, args } = message;
        const channelActions = this.channelHandlers[channel];
        const actionHandlers = channelActions?.[action];
        if (!actionHandlers)
            return [];
        return actionHandlers.map((handler) => handler(...args));
    }
    async handleIncomingMessage(rawMessage) {
        try {
            const message = JSON.parse(rawMessage);
            if (!message.channel || !message.action) {
                console.warn("Invalid message format: Missing channel or action", rawMessage);
                return;
            }
            if (message.channel === RESPONSE_CHANNEL) {
                this.processResponse(message);
            }
            else {
                await this.processRequest(message);
            }
        }
        catch (error) {
            console.error("Failed to parse message:", rawMessage, error);
        }
    }
    processResponse(message) {
        const { requestId, action, args } = message;
        if (!requestId)
            return;
        const pendingRequest = this.pendingRequests.get(requestId);
        if (!pendingRequest)
            return;
        if (action === RESPONSE_ACTION) {
            pendingRequest.resolve(args[0]);
        }
        else if (action === ERROR_ACTION) {
            pendingRequest.reject(args[0]);
        }
        this.pendingRequests.delete(requestId);
    }
    async processRequest(message) {
        const { requestId } = message;
        const results = this.emit(message);
        if (requestId && results.length > 0) {
            const result = results[0];
            const responseMessage = {
                channel: RESPONSE_CHANNEL,
                action: RESPONSE_ACTION,
                args: result instanceof Promise ? [await result] : [result],
                requestId,
            };
            this.client.send(JSON.stringify(responseMessage));
        }
    }
}
//# sourceMappingURL=MessageChannelManager.js.map