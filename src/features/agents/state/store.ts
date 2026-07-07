// V0 stub — agent state (gateway-free)
export type AgentState = {
  id: string;
  name: string;
  role: string;
  status: "idle" | "working" | "error";
};

export type AgentStoreSeed = {
  agentId: string;
  name: string;
  runtimeName?: string;
  identityName?: string;
  sessionDisplayName?: string;
  role?: string | null;
  avatarSeed?: string | null;
  model?: string | null;
  thinkingLevel?: string | null;
  sessionKey: string;
  agents?: AgentState[];
};
