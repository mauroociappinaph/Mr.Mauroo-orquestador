// V0 stub — SMS booth immersive
"use client";

import { MessageSquareText } from "lucide-react";

export type TextMessageStep = "idle" | "selecting_contact" | "composing" | "sent" | "sending" | "delivered" | "replied" | "reply" | "complete" | "ended";

export function SmsBoothImmersiveScreen(_props: {
  step: TextMessageStep;
  scenario: Record<string, unknown> | null;
  typedMessage: string;
  activeKey: string | null;
  contacts: string[];
  activeContactIndex: number | null;
  onEnd?: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <MessageSquareText size={48} className="text-muted-foreground" />
      <p className="text-muted-foreground">SMS — V0 placeholder</p>
    </div>
  );
}