// V0 stub — mock text message scenario builder
import type { MockTextMessageScenario } from "./types";

type BuildMockTextOptions = {
  recipient: string;
  message: string | null;
};

export function buildMockTextMessageScenario(opts?: BuildMockTextOptions): MockTextMessageScenario | null {
  if (!opts) return null;
  return {
    id: "v0-stub",
    senderName: opts.recipient,
    messages: opts.message ? [{ text: opts.message, from: "them" as const }] : [],
    recipient: opts.recipient,
    messageText: opts.message ?? "",
    confirmationText: "Sent",
  };
}
