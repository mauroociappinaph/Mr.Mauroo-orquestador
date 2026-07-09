import { AgentSpec, AgentInstance } from "../agent-types";

export class AgentRegistry {
  private agents: Map<string, AgentInstance> = new Map();

  constructor(initialSpecs: AgentSpec[]) {
    initialSpecs.forEach((spec) => {
      this.agents.set(spec.id, {
        spec,
        status: "idle",
        currentTask: null,
        deskId: null,
        position: { x: 0, z: 0 },
      });
    });
  }

  public register(agent: AgentInstance): void {
    this.agents.set(agent.spec.id, agent);
  }

  public getAll(): AgentInstance[] {
    return Array.from(this.agents.values());
  }

  public getById(id: string): AgentInstance | undefined {
    return this.agents.get(id);
  }
}
