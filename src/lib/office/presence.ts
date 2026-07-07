// V0 stub — no gateway presence
export type OfficeAgentPresence = {
  agentId: string;
  name: string;
  status: "online" | "offline" | "away";
  lastSeen: number;
};
