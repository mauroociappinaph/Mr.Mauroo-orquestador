import { AgentRegistry } from "./AgentRegistry";
import { AgentStateMachine } from "./AgentStateMachine";
import { AgentInstance } from "../../engine/agent-types";

export interface SchedulerConfig {
  tickIntervalMs: number;
  workDurationRange: [number, number];
}

export class BehaviorScheduler {
  private registry: AgentRegistry;
  private stateMachines: Map<string, AgentStateMachine>;
  private config: SchedulerConfig;
  private timer: NodeJS.Timeout | null = null;

  constructor(registry: AgentRegistry, stateMachines: Map<string, AgentStateMachine>, config: SchedulerConfig) {
    this.registry = registry;
    this.stateMachines = stateMachines;
    this.config = config;
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
    
    for (const agent of agents) {
      const sm = this.stateMachines.get(agent.spec.id);
      if (!sm) continue;

      const currentState = sm.getState();

      if (currentState === "idle") {
        this.scheduleWork(agent, sm);
      }
    }
  }

  private scheduleWork(agent: AgentInstance, sm: AgentStateMachine): void {
    console.info(`[BehaviorScheduler] Scheduling work for agent: ${agent.spec.name}`);
    
    // 1. Transition to working
    sm.transition("START_WORKING");

    // 2. Simulate work duration
    const duration = Math.floor(
      Math.random() * (this.config.workDurationRange[1] - this.config.workDurationRange[0]) + this.config.workDurationRange[0]
    );

    setTimeout(() => {
      console.info(`[BehaviorScheduler] Agent ${agent.spec.name} finished work after ${duration}ms`);
      sm.transition("FINISH_WORKING");
    }, duration);
  }
}
