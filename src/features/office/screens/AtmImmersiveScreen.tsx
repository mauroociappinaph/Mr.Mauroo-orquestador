// V0 stub — ATM immersive
"use client";

import { Landmark } from "lucide-react";

export type AtmImmersiveScreenProps = {
  gatewayUrl?: string;
};

export function AtmImmersiveScreen(_props: AtmImmersiveScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <Landmark size={48} className="text-muted-foreground" />
      <p className="text-muted-foreground">ATM — V0 (analytics coming soon)</p>
    </div>
  );
}
