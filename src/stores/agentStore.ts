import { create } from 'zustand';
import { AgentInstance } from '../engine/agent-types';

interface AgentStore {
  agents: AgentInstance[];
  setAgents: (agents: AgentInstance[]) => void;
  updateAgent: (id: string, update: Partial<AgentInstance>) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),
  updateAgent: (id, update) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.spec.id === id ? { ...a, ...update } : a)),
    })),
}));
