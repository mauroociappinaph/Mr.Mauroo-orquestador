import { AgentRegistry } from "./AgentRegistry";
import { AgentStateMachine } from "./AgentStateMachine";
import { AgentInstance } from "../../engine/agent-types";
import { GridCoordinate, GridMap } from "../navigation/GridMap";

export interface SchedulerConfig {
  tickIntervalMs: number;
  workDurationRange: [number, number];
  interactionDistance: number;
  interactionDurationMs: number;
}

export class BehaviorScheduler {
  private registry: AgentRegistry;
  private stateMachines: Map<string, AgentStateMachine>;
  private config: SchedulerConfig;
  private grid: GridMap;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    registry: AgentRegistry,
    stateMachines: Map<string, AgentStateMachine>,
    config: SchedulerConfig,
    grid: GridMap
  ) {
    this.registry = registry;
    this.stateMachines = stateMachines;
    this.config = config;
    this.grid = grid;
  }

  public start(): void {
    if (this.timer) return;
    console.info("[BehaviorScheduler] Starting autonomy loop...");
    this.timer = setInterval(() => this.tick(), this.config.tickIntervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.info("[BehaviorScheduler] Stopping autonomy loop...");
    }
  }

  private tick(): void {
    const agents = this.registry.getAll();
    
    // 1. Check for interactions (proximity based)
    this.checkInteractions(agents);

    // 2. Handle movement and work
    for (const agent of agents) {
      const sm = this.stateMachines.get(agent.spec.id);
      if (!sm) continue;

      const currentState = sm.getState();

      if (currentState === "idle") {
        this.scheduleWork(agent, sm);
      }
    }
  }

  private checkInteractions(agents: AgentInstance[]): void {
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const a1 = agents[i];
        const a2 = agents[j];

        const dx = a1.position.x - a2.position.x;
        const dz = a1.position.z - a2.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < this.config.interactionDistance) {
          this.triggerInteraction(a1, a2);
        }
      }
    }
  }

  private triggerInteraction(a1: AgentInstance, a2: AgentInstance): void {
    const sm1 = this.stateMachines.get(a1.spec.id);
    const sm2 = this.stateMachines.get(a2.spec.id);

    if (!sm1 || !sm2) return;

    if (sm1.getState() === "idle" && sm2.getState() === "idle") {
      console.info(`[BehaviorScheduler] Interaction triggered between ${a1.spec.name} and ${a2.spec.name}`);
      sm1.transition("START_INTERACTING");
      sm2.transition("START_INTERACTING");

      setTimeout(() => {
        console.info(`[BehaviorScheduler] Interaction finished between ${a1.spec.name} and ${a2.spec.name}`);
        sm1.transition("FINISH_INTERACTING");
        sm2.transition("FINISH_INTERACTING");
      }, this.config.interactionDurationMs);
    }
  }

  private scheduleWork(agent: AgentInstance, sm: AgentStateMachine): void {
    console.info(`[BehaviorScheduler] Scheduling work for agent: ${agent.spec.name}`);
    
    sm.transition("START_WORKING");

    // 1. Pick a destination (for simplicity, a random walkable cell)
    const destination = this.getRandomWalkableCell();
    if (!destination) {
      sm.transition("FINISH_WORKING");
      return;
    }

    // 2. Move to destination
    console.info(`[BehaviorScheduler] Agent ${agent.spec.name} moving to ${destination.x}, ${destination.z}`);
    // In a real implementation, we would use the A* pathfinder and update position frame-by-frame.
    // For this V0, we'll just jump to the destination to simulate movement.
    
    // We'll simulate the movement time.
    setTimeout(() => {
      console.info(`[BehaviorScheduler] Agent ${agent.spec.name} arrived at destination.`);
      
      // 3. Perform the "work"
      const workDuration = Math.floor(
        Math.random() * (this.config.workDurationRange[1] - this.config.workDurationRange[0]) + this.config.workDurationRange[0]
      );
      
      console.info(`[BehaviorScheduler] Agent ${agent.spec.name} working for ${workDuration}ms`);
      
      setTimeout(() => {
        console.info(`[BehaviorScheduler] Agent ${agent.spec.name} finished work.`);
        sm.transition("FINISH_WORKING");
      }, workDuration);
      
    }, 2000); // 2s travel time
  }

  private getRandomWalkableCell(): GridCoordinate | null {
    const width = this.grid.getSize().width;
    const depth = this.grid.getSize().depth;

    for (let attempts = 0; attempts < 10; attempts++) {
      const x = Math.floor(Math.random() * width);
      const z = Math.floor(Math.random() * depth);
      if (this.grid.isWalkable(x, z)) {
        return { x, z };
      }
    }
    return null;
  }
}
