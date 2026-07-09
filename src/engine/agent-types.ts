// === oficina-3d V0 — Local Agent Types ===
// Stripped-down agent model for local-only operation.

export type AgentRole = "architect" | "developer" | "reviewer" | "coordinator";

export type AgentStatus = "idle" | "thinking" | "working" | "interacting" | "error";

export interface AgentSpec {
  id: string;
  name: string;
  role: AgentRole;
  emoji: string;
  color: string;
  systemPrompt: string;
  startingPosition?: { x: number; z: number };
}

export interface AgentInstance {
  spec: AgentSpec;
  status: AgentStatus;
  currentTask: string | null;
  deskId: string | null;
  position: { x: number; z: number };
}

export interface EngineMessage {
  id: string;
  agentId: string;
  text: string;
  timestamp: number;
  type: "thought" | "action" | "result";
}
