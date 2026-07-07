// V0 stub — mock phone call scenario builder
import type { MockPhoneCallScenario } from "./types";

type BuildMockOptions = {
  callee: string;
  message: string | null;
  voiceAvailable: boolean;
};

export function buildMockPhoneCallScenario(opts?: BuildMockOptions): MockPhoneCallScenario | null {
  if (!opts) return null;
  return {
    id: "v0-stub",
    callerName: opts.callee,
    status: "ended" as const,
    dialNumber: opts.callee,
    spokenText: opts.message ?? "",
    recipientReply: "",
  };
}
