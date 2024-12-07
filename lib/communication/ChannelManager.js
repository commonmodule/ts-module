export default class ChannelManager {
    client;
    handlers = {};
    constructor(client) {
        this.client = client;
        client.onMessage((rawMessage) => this.parseAndEmit(rawMessage));
    }
    on(channel, action, handler) {
        if (!this.handlers[channel])
            this.handlers[channel] = {};
        const channelHandlers = this.handlers[channel];
        if (!channelHandlers[action])
            channelHandlers[action] = [];
        channelHandlers[action].push(handler);
        return this;
    }
    off(channel, action, handler) {
        const channelHandlers = this.handlers[channel];
        if (!channelHandlers)
            return this;
        const actionHandlers = channelHandlers[action];
        if (!actionHandlers)
            return this;
        if (!handler) {
            delete channelHandlers[action];
        }
        else {
            const index = actionHandlers.indexOf(handler);
            if (index !== -1)
                actionHandlers.splice(index, 1);
            if (actionHandlers.length === 0)
                delete channelHandlers[action];
        }
        if (Object.keys(channelHandlers).length === 0) {
            delete this.handlers[channel];
        }
        return this;
    }
    send(channel, action, data) {
        const message = { channel, action, data };
        this.client.send(JSON.stringify(message));
    }
    emit(message) {
        const { channel, action, data } = message;
        const channelHandlers = this.handlers[channel];
        const actionHandlers = channelHandlers?.[action];
        if (actionHandlers) {
            actionHandlers.forEach((handler) => handler(data));
        }
        else {
            console.warn(`No handler found for channel: ${channel}, action: ${action}`);
        }
    }
    parseAndEmit(rawMessage) {
        try {
            const message = JSON.parse(rawMessage);
            if (message.channel && message.action) {
                this.emit(message);
            }
            else {
                console.warn("Invalid message format: Missing channel or action", rawMessage);
            }
        }
        catch (error) {
            console.error("Failed to parse message:", rawMessage, error);
        }
    }
}
//# sourceMappingURL=ChannelManager.js.map