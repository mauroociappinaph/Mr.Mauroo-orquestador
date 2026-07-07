import { AgentInstance, AgentStatus } from "../agent-types";

export type AgentEvent = "START_WORKING" | "FINISH_WORKING" | "START_INTERACTING" | "FINISH_INTERACTING";

export class AgentStateMachine {
  private state: AgentStatus;
  private onStateChange: (newState: AgentStatus) => void;

  constructor(initialState: AgentStatus, onStateChange: (newState: AgentStatus) => void) {
    this.state = initialState;
    this.onStateChange = onStateChange;
  }

  public getState(): AgentStatus {
    return this.state;
  }

  public transition(event: AgentEvent): void {
    let newState: AgentStatus | null = null;

    switch (this.state) {
      case "idle":
        if (event === "START_WORKING") newState = "working";
        if (event === "START_INTERACTING") newState = "interacting";
        break;
      case "working":
        if (event === "FINISH_WORKING") newState = "idle";
        break;
      case "interacting":
        if (event === "FINISH_INTERACTING") newState = "idle";
        break;
      case "error":
        // Errors usually need a reset or manual intervention, 
        // but for this V0 we can allow reset to idle.
        if (event === "FINISH_WORKING") newState = "idle"; 
        break;
    }

    if (newState && newState !== this.state) {
      this.state = newState;
      this.onStateChange(this.state);
    } else {
      console.warn(`[AgentStateMachine] Invalid transition attempt: ${this.state} via ${event}`);
    }
  }
}
