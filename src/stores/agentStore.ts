import { create } from 'zustand';
import defaultAgents from '@/config/agents.default.json';
import { AgentInstance, AgentSpec } from '@/engine/agent-types';

const DEFAULT_AGENTS = defaultAgents as AgentSpec[];

interface AgentStore {
  agents: AgentInstance[];
  setAgents: (agents: AgentInstance[]) => void;
  updateAgent: (id: string, update: Partial<AgentInstance>) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: DEFAULT_AGENTS.map((spec) => ({
    spec,
    status: "idle",
    currentTask: null,
    deskId: null,
    position: { x: 0, z: 0 },
  })),

  setAgents: (agents) => set({ agents }),
  updateAgent: (id, update) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.spec.id === id ? { ...a, ...update } : a)),
    })),
}));
