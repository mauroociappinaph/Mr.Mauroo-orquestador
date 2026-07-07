// V0 stub — Phone booth immersive
"use client";

import { Phone } from "lucide-react";

export type PhoneCallStep = "idle" | "dialing" | "calling" | "ringing" | "connected" | "speaking" | "reply" | "complete" | "ended";

export function PhoneBoothImmersiveScreen(_props: {
  step: PhoneCallStep;
  scenario: Record<string, unknown> | null;
  typedDigits: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <Phone size={48} className="text-muted-foreground" />
      <p className="text-muted-foreground">Phone — V0 placeholder</p>
    </div>
  );
}
