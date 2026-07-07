// V0 stub — Standup immersive
"use client";

import type { StandupMeeting as StdMeeting } from "@/lib/office/standup/types";
import { MicVocal } from "lucide-react";

export type StandupImmersiveScreenProps = {
  meeting: StdMeeting;
  onClose: () => void;
};

export function StandupImmersiveScreen({ meeting, onClose }: StandupImmersiveScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <MicVocal size={48} className="text-muted-foreground" />
      <p className="text-muted-foreground">Standup — V0 placeholder</p>
    </div>
  );
}
