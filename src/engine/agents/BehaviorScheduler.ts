// === oficina-3d V0 — Behavior Scheduler ===
// Autonomy loop that drives agent behavior: proximity interactions, work cycles,
// meeting scheduling, and state persistence via the unified store.

import { useAgentStore } from "@/stores/agentStore";
import type { AgentInstance } from "@/engine/agent-types";
import type { GridCoordinate } from "../navigation/GridMap";
import type { GridMap } from "../navigation/GridMap";

// ── Types ────────────────────────────────────────────────────────────

export interface InteractionEvent {
  from: string;
  to: string;
  type: "start" | "end";
}

export interface SchedulerConfig {
  /** How often the tick runs in ms (default: 5000) */
  tickIntervalMs: number;
  /** Min and max work duration in ms (default: [5000, 15000]) */
  workDurationRange: [number, number];
  /** Distance threshold for proximity interaction in grid units (default: 2) */
  interactionDistance: number;
  /** How long an interaction lasts in ms (default: 8000) */
  interactionDurationMs: number;
  /** Probability [0-1] of scheduling a meeting per tick when idle agents exist (default: 0.3) */
  meetingProbability: number;
  /** Named meeting points available for scheduled meetings */
  meetingPoints: GridCoordinate[];
}

const DEFAULT_CONFIG: SchedulerConfig = {
  tickIntervalMs: 5000,
  workDurationRange: [5000, 15000],
  interactionDistance: 2,
  interactionDurationMs: 8000,
  meetingProbability: 0.3,
  meetingPoints: [],
};

// ── Scheduler ────────────────────────────────────────────────────────

export class BehaviorScheduler {
  private grid: GridMap;
  private config: SchedulerConfig;
  private timer: ReturnType<typeof setInterval> | null = null;
  private interactingTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  /** Timestamp (ms) of when each agent last finished an interaction — prevents immediate re-trigger */
  private lastInteractionTimestamps: Map<string, number> = new Map();
  private onInteraction?: (event: InteractionEvent) => void;

  constructor(
    grid: GridMap,
    config?: Partial<SchedulerConfig>,
    onInteraction?: (event: InteractionEvent) => void,
  ) {
    this.grid = grid;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.onInteraction = onInteraction;
  }

  // ── Lifecycle ────────────────────────────────────────────────────

  public start(): void {
    if (this.timer) return;
    console.info("[BehaviorScheduler] Starting autonomy loop...");
    this.timer = setInterval(() => this.tick(), this.config.tickIntervalMs);
    // Run first tick immediately
    this.tick();
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    for (const [, timer] of this.interactingTimers) {
      clearTimeout(timer);
    }
    this.interactingTimers.clear();
    console.info("[BehaviorScheduler] Stopped.");
  }

  // ── Public API ────────────────────────────────────────────────────

  /** Schedule a meeting between two agents at a specific meeting point. */
  public scheduleMeeting(
    agentId1: string,
    agentId2: string,
    meetingIndex?: number,
  ): boolean {
    if (this.config.meetingPoints.length === 0) return false;

    const idx =
      meetingIndex !== undefined
        ? Math.min(meetingIndex, this.config.meetingPoints.length - 1)
        : Math.floor(Math.random() * this.config.meetingPoints.length);

    const point = this.config.meetingPoints[idx];
    const store = useAgentStore.getState();
    const a1 = store.agents.find((a) => a.spec.id === agentId1);
    const a2 = store.agents.find((a) => a.spec.id === agentId2);

    if (!a1 || !a2 || a1.status !== "idle" || a2.status !== "idle") return false;

    console.info(
      `[BehaviorScheduler] Meeting scheduled: ${a1.spec.name} + ${a2.spec.name} @ (${point.x}, ${point.z})`,
    );

    // Move both agents toward the meeting point
    store.updateAgent(agentId1, {
      status: "working" as const,
      currentTask: `meeting with ${a2.spec.name}`,
      position: { x: point.x, z: point.z },
    });
    store.updateAgent(agentId2, {
      status: "working" as const,
      currentTask: `meeting with ${a1.spec.name}`,
      position: { x: point.x, z: point.z },
    });

    // Estimate travel time from the furthest agent (Manhattan distance / walk speed)
    const dist1 = Math.abs(a1.position.x - point.x) + Math.abs(a1.position.z - point.z);
    const dist2 = Math.abs(a2.position.x - point.x) + Math.abs(a2.position.z - point.z);
    const travelMs = Math.max(500, Math.ceil(Math.max(dist1, dist2) / 2 * 1000));
    setTimeout(() => {
      const laterStore = useAgentStore.getState();
      const a1Later = laterStore.agents.find((a) => a.spec.id === agentId1);
      const a2Later = laterStore.agents.find((a) => a.spec.id === agentId2);
      if (!a1Later || !a2Later) return;

      laterStore.setAgentStatus(agentId1, "interacting");
      laterStore.setAgentStatus(agentId2, "interacting");
      laterStore.addMessage({
        id: `meet-${agentId1}-${agentId2}-${Date.now()}`,
        agentId: agentId1,
        text: `Meeting with ${a2Later.spec.name}`,
        timestamp: Date.now(),
        type: "action",
      });

      this.onInteraction?.({ from: agentId1, to: agentId2, type: "start" });

      const clearTimer = setTimeout(() => {
        const s = useAgentStore.getState();
        s.setAgentStatus(agentId1, "idle");
        s.setAgentStatus(agentId2, "idle");
        this.interactingTimers.delete(agentId1);
        this.interactingTimers.delete(agentId2);
        this.lastInteractionTimestamps.set(agentId1, Date.now());
        this.lastInteractionTimestamps.set(agentId2, Date.now());
        this.onInteraction?.({ from: agentId1, to: agentId2, type: "end" });
      }, this.config.interactionDurationMs);

      this.interactingTimers.set(agentId1, clearTimer);
      this.interactingTimers.set(agentId2, clearTimer);
    }, travelMs);

    return true;
  }

  // ── Tick ─────────────────────────────────────────────────────────

  private tick(): void {
    const store = useAgentStore.getState();
    const agents = store.agents;
    if (agents.length < 2) return;

    // Prune stale cooldown entries (only keep within twice the interval)
    const now = Date.now();
    const pruneAfter = this.config.tickIntervalMs * 2;
    for (const [id, ts] of this.lastInteractionTimestamps) {
      if (now - ts > pruneAfter) this.lastInteractionTimestamps.delete(id);
    }

    this.checkProximityInteractions(agents, store);
    this.scheduleIdleWork(agents, store);
  }

  // ── Proximity Interaction ────────────────────────────────────────

  private checkProximityInteractions(
    agents: AgentInstance[],
    store: ReturnType<typeof useAgentStore.getState>,
  ): void {
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const a1 = agents[i];
        const a2 = agents[j];

        // Both must be idle to start a new interaction
        if (a1.status !== "idle" || a2.status !== "idle") continue;

        const dx = a1.position.x - a2.position.x;
        const dz = a1.position.z - a2.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < this.config.interactionDistance) {
          this.triggerInteraction(a1, a2, store);
        }
      }
    }
  }

  private triggerInteraction(
    a1: AgentInstance,
    a2: AgentInstance,
    store: ReturnType<typeof useAgentStore.getState>,
  ): void {
    // Guard: prevent double-triggering and cooldown
    if (this.interactingTimers.has(a1.spec.id) || this.interactingTimers.has(a2.spec.id)) return;
    const now = Date.now();
    const cooldown = this.config.tickIntervalMs;
    if (now - (this.lastInteractionTimestamps.get(a1.spec.id) ?? 0) < cooldown) return;
    if (now - (this.lastInteractionTimestamps.get(a2.spec.id) ?? 0) < cooldown) return;

    console.info(
      `[BehaviorScheduler] Proximity interaction: ${a1.spec.name} <-> ${a2.spec.name}`,
    );

    // Persist to unified store
    store.setAgentStatus(a1.spec.id, "interacting");
    store.setAgentStatus(a2.spec.id, "interacting");

    store.addMessage({
      id: `prox-${a1.spec.id}-${Date.now()}`,
      agentId: a1.spec.id,
      text: `Interacting with ${a2.spec.name}`,
      timestamp: Date.now(),
      type: "action",
    });

    this.onInteraction?.({ from: a1.spec.id, to: a2.spec.id, type: "start" });

    // Schedule interaction end
    const timer = setTimeout(() => {
      const s = useAgentStore.getState();
      s.setAgentStatus(a1.spec.id, "idle");
      s.setAgentStatus(a2.spec.id, "idle");
      this.interactingTimers.delete(a1.spec.id);
      this.interactingTimers.delete(a2.spec.id);
      this.lastInteractionTimestamps.set(a1.spec.id, Date.now());
      this.lastInteractionTimestamps.set(a2.spec.id, Date.now());
      this.onInteraction?.({ from: a1.spec.id, to: a2.spec.id, type: "end" });
    }, this.config.interactionDurationMs);

    this.interactingTimers.set(a1.spec.id, timer);
    this.interactingTimers.set(a2.spec.id, timer);
  }

  // ── Work Scheduling ──────────────────────────────────────────────

  private scheduleIdleWork(
    agents: AgentInstance[],
    store: ReturnType<typeof useAgentStore.getState>,
  ): void {
    const idleAgents = agents.filter((a) => a.status === "idle");
    if (idleAgents.length === 0) return;

    // Optionally schedule a meeting instead of solo work
    if (idleAgents.length >= 2 && Math.random() < this.config.meetingProbability) {
      // Pick two random idle agents for a meeting
      const idx1 = Math.floor(Math.random() * idleAgents.length);
      let idx2 = Math.floor(Math.random() * (idleAgents.length - 1));
      if (idx2 >= idx1) idx2 += 1;
      this.scheduleMeeting(idleAgents[idx1].spec.id, idleAgents[idx2].spec.id);
      return;
    }

    // Regular work assignment for remaining idle agents
    for (const agent of idleAgents) {
      // Skip if this agent was already picked for a meeting
      if (agent.status !== "idle") continue;

      const destination = this.getRandomWalkableCell();
      if (!destination) continue;

      console.info(
        `[BehaviorScheduler] ${agent.spec.name} → work at (${destination.x}, ${destination.z})`,
      );

      store.updateAgent(agent.spec.id, {
        status: "working",
        currentTask: "working",
        position: { x: destination.x, z: destination.z },
      });

      const duration = this.getRandomWorkDuration();
      setTimeout(() => {
        const s = useAgentStore.getState();
        s.setAgentStatus(agent.spec.id, "idle");
      }, duration);
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────

  private getRandomWalkableCell(): GridCoordinate | null {
    const { width, depth } = this.grid.getSize();
    for (let attempt = 0; attempt < 10; attempt++) {
      const x = Math.floor(Math.random() * width);
      const z = Math.floor(Math.random() * depth);
      if (this.grid.isWalkable(x, z)) {
        return { x, z };
      }
    }
    return null;
  }

  private getRandomWorkDuration(): number {
    const [min, max] = this.config.workDurationRange;
    return Math.floor(Math.random() * (max - min) + min);
  }
}
