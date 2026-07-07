// V0 stub — office animation state
import type { OfficeCleaningCue } from "./janitorReset";

export type OfficeAnimationState = {
  cleaningCues: OfficeCleaningCue[];
  danceUntilByAgentId: Record<string, number>;
  deskHoldByAgentId: Record<string, boolean>;
  githubHoldByAgentId: Record<string, boolean>;
  gymHoldByAgentId: Record<string, boolean>;
  phoneBoothHoldByAgentId: Record<string, boolean>;
  smsBoothHoldByAgentId: Record<string, boolean>;
  qaHoldByAgentId: Record<string, boolean>;
  jukeboxHoldByAgentId: Record<string, boolean>;
};
