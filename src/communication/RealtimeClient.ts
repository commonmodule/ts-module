export default interface RealtimeClient {
  send(message: string): void;
  onMessage(handler: (message: string) => void): void;
}
