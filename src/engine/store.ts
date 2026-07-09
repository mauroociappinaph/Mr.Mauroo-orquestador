// === oficina-3d V0 — Local Engine Store ===
// Lightweight Zustand store for office + agent state.

import { create } from "zustand";
import type { AgentInstance, AgentSpec, EngineMessage, AgentStatus } from "./agent-types";

const DEFAULT_AGENTS: AgentSpec[] = [
  {
    id: "arch-1",
    name: "Archi",
    role: "architect",
    emoji: "🏗️",
    color: "#60a5fa",
    systemPrompt: "You are a software architect. Design systems, evaluate tradeoffs, produce ADRs.",
  },
  {
    id: "dev-1",
    name: "Devvy",
    role: "developer",
    emoji: "⚡",
    color: "#34d399",
    systemPrompt: "You are a senior developer. Write clean, testable, well-typed code.",
  },
  {
    id: "rev-1",
    name: "Revi",
    role: "reviewer",
    emoji: "🔍",
    color: "#fbbf24",
    systemPrompt: "You are a code reviewer. Find bugs, security issues, and design flaws.",
  },
  {
    id: "coor-1",
    name: "Coodi",
    role: "coordinator",
    emoji: "🎯",
    color: "#f472b6",
    systemPrompt: "You are a coordinator. Break down work, assign tasks, track progress.",
  },
];

export interface EngineState {
  agents: AgentInstance[];
  messages: EngineMessage[];
  deskCount: number;

  // Actions
  setAgentStatus: (agentId: string, status: AgentStatus, task?: string) => void;
  addMessage: (msg: EngineMessage) => void;
  setDeskCount: (n: number) => void;
  resetAgents: () => void;
}

export const useEngineStore = create<EngineState>((set) => ({
  agents: DEFAULT_AGENTS.map((spec) => ({
    spec,
    status: "idle" as AgentStatus,
    currentTask: null,
    deskId: null,
    position: { x: 0, z: 0 },
  })),

  messages: [],
  deskCount: 8,

  setAgentStatus: (agentId, status, task) =>
    set((s) => ({
      agents: s.agents.map((a) =>
        a.spec.id === agentId ? { ...a, status, currentTask: task ?? a.currentTask } : a,
      ),
    })),

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, msg].slice(-200), // keep last 200
    })),

  setDeskCount: (n) => set({ deskCount: n }),

  resetAgents: () =>
    set((s) => ({
      agents: s.agents.map((a) => ({ ...a, status: "idle" as AgentStatus, currentTask: null })),
    })),
}));
