import EventContainer from "../event/EventContainer.js";

export default abstract class TokenManager extends EventContainer<{
  tokenChanged: (token: string | undefined) => void;
}> {
  public abstract get token(): string | undefined;
}
