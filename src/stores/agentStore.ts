import { create } from 'zustand';
import { AgentInstance, AgentSpec } from '@/engine/agent-types';

const DEFAULT_AGENTS: AgentSpec[] = [
  {
    id: "architect",
    name: "Architect",
    role: "architect",
    emoji: "🏗️",
    color: "#3b82f6",
    systemPrompt: "You are a software architect. Design systems, evaluate tradeoffs, produce ADRs.",
  },
  {
    id: "developer",
    name: "Developer",
    role: "developer",
    emoji: "⚡",
    color: "#10b981",
    systemPrompt: "You are a senior developer. Write clean, testable, well-typed code.",
  },
  {
    id: "reviewer",
    name: "Reviewer",
    role: "reviewer",
    emoji: "🔍",
    color: "#f59e0b",
    systemPrompt: "You are a code reviewer. Find bugs, security issues, and design flaws.",
  },
  {
    id: "coordinator",
    name: "Coordinator",
    role: "coordinator",
    emoji: "🎯",
    color: "#8b5cf6",
    systemPrompt: "You are a coordinator. Break down work, assign tasks, track progress.",
  },
];

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
  })),

  setAgents: (agents) => set({ agents }),
  updateAgent: (id, update) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.spec.id === id ? { ...a, ...update } : a)),
    })),
}));
