// === oficina-3d V0 — Unified Agent Store ===
// Single source of truth for agent state, messages, and scene config.

import { create } from 'zustand';
import defaultAgents from '@/config/agents.default.json';
import { AgentInstance, AgentSpec, EngineMessage, AgentStatus } from '@/engine/agent-types';

const DEFAULT_AGENTS = defaultAgents as AgentSpec[];

interface AgentStore {
  agents: AgentInstance[];
  messages: EngineMessage[];
  deskCount: number;

  setAgents: (agents: AgentInstance[]) => void;
  updateAgent: (id: string, update: Partial<AgentInstance>) => void;
  setAgentStatus: (agentId: string, status: AgentStatus, task?: string) => void;
  addMessage: (msg: EngineMessage) => void;
  setDeskCount: (n: number) => void;
  resetAgents: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: DEFAULT_AGENTS.map((spec) => ({
    spec,
    status: "idle" as AgentStatus,
    currentTask: null,
    deskId: null,
    position: spec.startingPosition ?? { x: 0, z: 0 },
  })),

  messages: [],
  deskCount: 8,

  setAgents: (agents) => set({ agents }),

  updateAgent: (id, update) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.spec.id === id ? { ...a, ...update } : a)),
    })),

  setAgentStatus: (agentId, status, task) =>
    set((s) => ({
      agents: s.agents.map((a) =>
        a.spec.id === agentId ? { ...a, status, currentTask: task ?? a.currentTask } : a,
      ),
    })),

  addMessage: (msg) =>
    set((s) => ({
      messages: [...s.messages, msg].slice(-200),
    })),

  setDeskCount: (n) => set({ deskCount: n }),

  resetAgents: () =>
    set((s) => ({
      agents: s.agents.map((a) => ({
        ...a,
        status: "idle" as AgentStatus,
        currentTask: null,
        position: a.spec.startingPosition ?? { x: 0, z: 0 },
      })),
    })),
}));
