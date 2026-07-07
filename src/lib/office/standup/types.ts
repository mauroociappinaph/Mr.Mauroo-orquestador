// V0 stub — standup types (expanded for RetroOffice3D compat)
export type StandupMeeting = {
  id: string;
  title: string;
  inProgress: boolean;
  phase?: "gathering" | "in_progress" | "finished";
  participants: string[];
  startedAt?: string;
  progress?: number;
  currentSpeakerAgentId?: string;
  arrivedAgentIds: string[];
  participantOrder: string[];
  cards: { agentId: string; agentName?: string; text?: string; speech?: string }[];
};
