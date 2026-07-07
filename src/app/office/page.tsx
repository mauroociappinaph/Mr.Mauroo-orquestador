// V0 — oficina-3d office page with RetroOffice3D + engine store
"use client";

import { RetroOffice3D } from "@/features/retro-office/RetroOffice3D";
import { useEngineStore } from "@/engine/store";
import { useMemo } from "react";
import type { OfficeAgent } from "@/features/retro-office/core/types";

export default function OfficePage() {
  const agents = useEngineStore((s) => s.agents);

  const officeAgents: OfficeAgent[] = useMemo(
    () =>
      agents.map((a) => ({
        id: a.spec.id,
        name: a.spec.name,
        subtitle: a.spec.role,
        status: a.status === "error" ? "error" : a.status === "idle" ? "idle" : "working",
        color: a.spec.color,
        item: a.spec.emoji,
      })),
    [agents],
  );

  return (
    <div className="h-dvh w-full">
      <RetroOffice3D
        agents={officeAgents}
        officeTitle="oficina-3d V0"
        officeTitleLoaded={true}
      />
    </div>
  );
}
